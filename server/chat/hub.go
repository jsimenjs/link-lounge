package chat

import (
	"fmt"
)

type Hub struct {
	manager    *Manager
	id         string
	clients    map[*Client]bool
	broadcast  chan []byte
	register   chan *Client
	unregister chan *Client
}

func newHub(manager *Manager, id string) *Hub {
	return &Hub{
		manager:    manager,
		id:         id,
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) run() {
	for {
		select {
		// Client wants to register
		case client := <-h.register:
			h.clients[client] = true
            h.manager.print();
			// Client wants to unregister
		case client := <-h.unregister:
			// Unregister if client is registered
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
            h.manager.print();

			// Client wants to broadcast a message to all registered clients
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				// Send message to client
				case client.send <- message:
					// Unable to send message to the client (send buffer must be full). Close the connection and unregister the client.
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}

func (h *Hub) toString() string {
	return fmt.Sprintf("%s (%d clients)", h.id, len(h.clients))
}

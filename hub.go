package main

import "fmt"

type Hub struct {
    clients map[*Client]bool
    broadcast chan []byte
    register chan *Client
    unregister chan *Client
}

func newHub() *Hub {
    return &Hub{
        clients: make(map[*Client]bool),
        broadcast: make(chan []byte),
        register: make(chan *Client),
        unregister: make(chan *Client),
    }
}

func (h *Hub) run() {
    for {
        select {
            // Client wants to register
        case client := <-h.register:
            h.clients[client] = true
            fmt.Printf("\033[2K\rRegistered clients: %d", len(h.clients))
            // Client wants to unregister
        case client := <-h.unregister:
            // Unregister if client is registered
            if _, ok := h.clients[client]; ok {
                delete(h.clients, client)
                close(client.send)
            }
            fmt.Printf("\033[2K\rRegistered clients: %d", len(h.clients))

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


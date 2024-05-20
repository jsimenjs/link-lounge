package main

import (
	"fmt"
	"log"
	"net/http"
)

type Manager struct {
	hubs []*Hub
}

func main() {
	manager := Manager{}
	http.HandleFunc("/{id}/ws", func(w http.ResponseWriter, r *http.Request) {
		id := r.PathValue("id")
		for _, hub := range manager.hubs {
			if id == hub.id {
				serveWs(hub, w, r)
				return
			}
		}
		hub := newHub(&manager, id)
		go hub.run()
		serveWs(hub, w, r)
		manager.hubs = append(manager.hubs, hub)
		fmt.Printf("Created new hub with id: %s\n", hub.id)
	})
	http.Handle("/", http.FileServer(http.Dir("public")))
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func (m *Manager) print() {
		fmt.Println("Hubs:")
		for i, hub := range m.hubs {
			fmt.Printf("%d: %s\n", i, hub.toString())
		}
}

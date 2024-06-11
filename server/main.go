package main

import (
	"fmt"
	"net/http"

	"github.com/jsimenjs/chat-app/middleware"
)

type Manager struct {
	hubs []*Hub
}

func main() {
    router := http.NewServeMux()
	router.Handle("/", http.FileServer(http.Dir("../dist")))


	manager := Manager{}
	router.HandleFunc("/{id}/ws", func(w http.ResponseWriter, r *http.Request) {
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

    stack := middleware.CreateMiddlewareStack(
        middleware.Logging,
    )

    server := http.Server {
        Addr: ":8080",
        Handler: stack(router),
    }

    server.ListenAndServe()
}

func (m *Manager) print() {
		fmt.Println("Hubs:")
		for i, hub := range m.hubs {
			fmt.Printf("%d: %s\n", i, hub.toString())
		}
}

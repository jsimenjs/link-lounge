package main

import (
	"net/http"

	"github.com/jsimenjs/chat-app/middleware"
)

func main() {
	router := http.NewServeMux()
	router.Handle("/", http.FileServer(http.Dir("../dist")))

	manager := NewManager()
	router.HandleFunc("/{id}/ws", manager.ServeHub)

	stack := middleware.CreateMiddlewareStack(
		middleware.Logging,
	)

	server := http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}

	server.ListenAndServe()
}

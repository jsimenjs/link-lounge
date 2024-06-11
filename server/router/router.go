package router

import (
	"net/http"

	"github.com/jsimenjs/chat-app/chat"
)

func New() *http.ServeMux {
	router := http.NewServeMux()
	router.Handle("/", http.FileServer(http.Dir("../dist")))
	manager := chat.NewManager()
	router.HandleFunc("/{id}/ws", manager.ServeHub)

	return router
}


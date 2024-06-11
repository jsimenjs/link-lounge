package main

import (
	"net/http"

	"github.com/jsimenjs/chat-app/middleware"
	"github.com/jsimenjs/chat-app/router"
)

func main() {
	router := router.New()

	stack := middleware.CreateMiddlewareStack(
		middleware.Logging,
	)

	server := http.Server{
		Addr:    ":8080",
		Handler: stack(router),
	}

	server.ListenAndServe()
}

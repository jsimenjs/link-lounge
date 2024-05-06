const chat = document.getElementById('chat')
const chatInput = document.getElementById('chat-input')
const chatForm = document.getElementById('chat-form')
let timeout = 5000
let attempt = 0

function connectWebSocket() {
    attempt++
    let socket = new WebSocket('ws://localhost:8080/ws');

    socket.onmessage = (event) => {
        let date = new Date(Date.now())
        chat.value += `\n[${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}]: ${event.data}`
    }

    socket.onopen = () => {
        socket.send("Hello Server!");
        chat.value += 'Connected.'
    }

    socket.onclose = () => {
        socket = null
        setTimeout(connectWebSocket, timeout)
        timeout = timeout * (2 ** attempt)
        chat.value += '\nReconnecting... '
    }

    chatForm.addEventListener("submit", () => {
        if (!socket) return
        socket.send(chatInput.value)
        chatInput.value = ''
    })

}

connectWebSocket()

chat.style = `
height: 50vh;
width: max-content;
`

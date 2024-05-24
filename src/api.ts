import { ChatEvent } from "./types"

export const sendMessage = (message: string, ws: WebSocket | null) => {
    if (ws === null || ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) return
    const chatEvent: ChatEvent = { type: 'user-event', payload: message }
    ws.send(JSON.stringify(chatEvent))
}


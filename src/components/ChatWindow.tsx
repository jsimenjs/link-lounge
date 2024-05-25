import { useEffect, useRef, useState } from "react";
import ChatHistory from "./ChatHistory"
import MessageForm from "./MessageForm"
import NavigationForm from "./NavigationForm"
import { ChatEvent } from "../types";
import { bytesToBase64 } from "../utils";

const ChatWindow = () => {
    const [chatHistory, setChatHistory] = useState<ChatEvent[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null)
    const wsRef = useRef<WebSocket | null>(null)
    const [roomId, setRoomId] = useState("")

    useEffect(() => {
        console.log('ws useEffect triggered')
        if (roomId === "") { return }
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED || wsRef.current.readyState === WebSocket.CLOSING) {
            console.log(`Opening a new ws connection to id: ${roomId}`)
            const ws = new WebSocket(`ws://localhost:8080/${bytesToBase64(new TextEncoder().encode(roomId))}/ws`);
            wsRef.current = ws
            wsRef.current.onmessage = (event) => {
                //const date = new Date(Date.now())
                //const timestamp = `[${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}]`
                const chatEvent: ChatEvent = JSON.parse(event.data)
                console.log(chatEvent)
                setChatHistory(chatHistory => chatHistory.concat(chatEvent))
            }

            wsRef.current.onopen = () => {
                const chatEvent: ChatEvent = { type: "status", payload: 'Connected.' }
                setChatHistory(chatHistory => chatHistory.concat(chatEvent))
            }

            wsRef.current.onclose = () => {
                const chatEvent: ChatEvent = { type: "status", payload: 'Connection closed.' }
                setChatHistory(chatHistory => chatHistory.concat(chatEvent))
            }
            setWs(ws)
        }

        return () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                console.log('ws cleanup function: closing ws connection')
                wsRef.current.close()
                return
            }
            console.log('ws cleanup function: no action')
        }
    }, [roomId])

    return (
        <div id="chat-window" className='p-2 flex flex-col gap-2 grow bg-zinc-700 rounded-xl'>
            <NavigationForm setRoomId={setRoomId} />
            <ChatHistory chatHistory={chatHistory} />
            <MessageForm ws={ws} />
        </div>
    )
}

export default ChatWindow

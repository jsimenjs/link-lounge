import { FormEvent, useEffect, useRef, useState } from 'react'
import './App.css'

type ChatEvent = {
    type: string
    payload: string
}

function App() {
    const [chatHistory, setChatHistory] = useState<ChatEvent[]>([]);
    const [chatInput, setChatInput] = useState("")
    const [ws, setWs] = useState<WebSocket | null>(null)
    const wsRef = useRef<WebSocket | null>(null)

    useEffect(() => {
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
            const ws = new WebSocket('ws://localhost:8080/ws');
            wsRef.current = ws
            setWs(ws)
        }

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
        return () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close()
            }
        }
    }, [])

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()
        if (ws === null || ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) return
        const chatEvent: ChatEvent = { type: 'user-event', payload: chatInput }
        ws.send(JSON.stringify(chatEvent))
        setChatInput("")
    }

    return (
        <>
            <h1>Chat</h1>
            <div>
                {chatHistory.map((chatEvent: ChatEvent, index: number) => {
                    return <ChatEvent key={index} chatEvent={chatEvent} />
                })}
            </div>
            <form onSubmit={(e) => submitHandler(e)}>
                <input type="text" value={chatInput} onChange={(e) => { setChatInput(e.target.value) }} />
                <button>Send</button>
            </form>
        </>
    )
}

type ChatEventProps = {
    chatEvent: ChatEvent
}

const ChatEvent = (props: ChatEventProps) => {
    const { chatEvent } = props
    if (chatEvent.type === 'user-event') {
        return <ChatMessage message={chatEvent.payload} />

    }
    if (chatEvent.type === 'status') {
        return <ChatMessage message={'> ' + chatEvent.payload} />
    }
    return (
        <></>
    )
}

type ChatMessageProps = {
    message: string
}

const ChatMessage = (props: ChatMessageProps) => {
    const { message } = props
    return (
        <p>{message}</p>
    )
}

export default App

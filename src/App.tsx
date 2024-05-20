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
    const [destination, setDestination] = useState("general");
    const [roomId, setRoomId] = useState("")

    function bytesToBase64(bytes: Uint8Array) {
        const binString = Array.from(bytes, (byte) =>
            String.fromCodePoint(byte),
        ).join("");
        return btoa(binString);
    }

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

    const navigateHandler = (e: FormEvent) => {
        e.preventDefault()
        setRoomId(destination)
    }

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
            <h2 id="location">Location: {roomId !== "" ? roomId : "N/A"}</h2>
            <form onSubmit={navigateHandler}>
                <label htmlFor="destination">Destination: </label>
                <input id="destination" type="text" placeholder="Paste link" onChange={(e) => { setDestination(e.target.value) }}></input>
                <button>Go</button>
            </form>
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

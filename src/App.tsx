import { FormEvent, useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
    const [chatHistory, setChatHistory] = useState("");
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
            let date = new Date(Date.now())
            setChatHistory(chatHistory => chatHistory + `\n[${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}]: ${event.data}`)
        }

        wsRef.current.onopen = () => {
            setChatHistory(chatHistory => chatHistory + '=> Connected.')
        }

        wsRef.current.onclose = () => {
            setChatHistory(chatHistory => chatHistory + '\n=> Connection closed. ')
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
        ws.send(chatInput)
        setChatInput("")
    }

    return (
        <>
            <h1>Chat</h1>
            <textarea value={chatHistory} readOnly />
            <form onSubmit={(e) => submitHandler(e)}>
                <input type="text" value={chatInput} onChange={(e) => { setChatInput(e.target.value) }} />
                <button>Send</button>
            </form>
        </>
    )
}

export default App

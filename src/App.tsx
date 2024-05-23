import { FormEvent, SetStateAction, useEffect, useRef, useState } from 'react'
import './App.css'

type ChatEvent = {
    type: string
    payload: string
}

function App() {
    let sampleHistory = []
    for (let i = 0; i < 100; i++) {
        sampleHistory.push({ type: 'status', payload: 'abcd' })
    }
    const [chatHistory, setChatHistory] = useState<ChatEvent[]>([]);
    const [ws, setWs] = useState<WebSocket | null>(null)
    const wsRef = useRef<WebSocket | null>(null)
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



    return (
        <div className='h-full flex flex-col gap-2 p-2'>
            <h1 className='text-5xl'>Chat</h1>
            <ChatWindow chatHistory={chatHistory} ws={ws} setRoomId={setRoomId} />
        </div>
    )
}

type ChatWindowProps = {
    chatHistory: ChatEvent[]
    ws: WebSocket | null
    setRoomId: React.Dispatch<SetStateAction<string>>
}

const ChatWindow = (props: ChatWindowProps) => {
    const { chatHistory, ws, setRoomId } = props
    return (
        <div id="chat-window" className='flex flex-col gap-1 grow'>
            <NavigationForm setRoomId={setRoomId} />
            <ChatHistory chatHistory={chatHistory} />
            <MessageForm ws={ws} />
        </div>
    )
}

type ChatHistoryProps = {
    chatHistory: ChatEvent[]
}

const ChatHistory = (props: ChatHistoryProps) => {
    const { chatHistory } = props
    return (
        <div id="chat-history" className='h-0 overflow-scroll grow flex flex-col-reverse'>
            <div className='flex flex-col gap-1'>
                {
                    chatHistory.map((chatEvent: ChatEvent, index: number) => {
                        return <ChatEvent key={index} chatEvent={chatEvent} />
                    })
                }
            </div>
        </div>
    )
}

type MessageFormProps = {
    ws: WebSocket | null
}

const MessageForm = (props: MessageFormProps) => {
    const { ws } = props
    const [chatInput, setChatInput] = useState("")

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()
        if (ws === null || ws.readyState === WebSocket.CLOSING || ws.readyState === WebSocket.CLOSED) return
        const chatEvent: ChatEvent = { type: 'user-event', payload: chatInput }
        ws.send(JSON.stringify(chatEvent))
        setChatInput("")
    }

    return (
        <form id="message-form" onSubmit={(e) => submitHandler(e)} className='flex flex-row w-full bg-zinc-200 p-1 rounded-lg'>
            <input type="text" placeholder='Type a message' value={chatInput} onChange={(e) => { setChatInput(e.target.value) }} className='bg-inherit w-full' />
            <button type="submit" className='p-0.5 px-2 border-l border-white'>Send</button>
        </form >
    )
}

type NavigationFormProps = {
    setRoomId: React.Dispatch<SetStateAction<string>>
}

const NavigationForm = (props: NavigationFormProps) => {
    const { setRoomId } = props;
    const [destination, setDestination] = useState("general");

    const navigateHandler = (e: FormEvent) => {
        e.preventDefault()
        setRoomId(destination)
    }

    return (
        <form id="navigation-form" onSubmit={navigateHandler} className='flex flex-row'>
            <div className='flex rounded-lg overflow-clip bg-zinc-200 p-1 w-full'>
                <input id="destination" type="text" placeholder="Paste a URL" onChange={(e) => { setDestination(e.target.value) }} className='w-full bg-inherit'></input>
                <button className='border-l border-white p-0.5 px-2'>Go</button>
            </div>
        </form>
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
        return (
            <div className='bg-orange-200 rounded-md p-0.5 flex flex-row'>
                <div className='w-full'>
                    <ChatMessage message={chatEvent.payload} />
                </div>
                <div className='italic opacity-50'>
                    {chatEvent.type}
                </div>
            </div>
        )
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

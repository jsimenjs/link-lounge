import { PropsWithChildren, SetStateAction, useEffect, useRef, useState } from "react";
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
    // const [readyState, setReadyState] = useState<number | null>(null)
    const host = import.meta.env.DEV ? 'localhost:8080' : location.host

    useEffect(() => {
        console.log('ws useEffect triggered')
        if (roomId === "") { return }
        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED || wsRef.current.readyState === WebSocket.CLOSING) {
            console.log(`Opening a new ws connection to id: ${roomId}`)
            const ws = new WebSocket(`ws://${host}/${bytesToBase64(new TextEncoder().encode(roomId))}/ws`);
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

            wsRef.current.onerror = () => {
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
        <div id="chat-window" className={`p-2 flex flex-col gap-2 grow bg-zinc-700 rounded-xl` + (ws ? `` : ` grow-0`)}>
            <ChatHeader ws={ws} setRoomId={setRoomId}>
                <NavigationForm setRoomId={setRoomId} />
            </ChatHeader>
            {ws ? <ChatHistory chatHistory={chatHistory} /> : null}
            {ws ? <MessageForm ws={ws} /> : null}
        </div>
    )
}

type ChatHeaderProps = PropsWithChildren & {
    ws: WebSocket | null
    setRoomId: React.Dispatch<SetStateAction<string>>
}

const ChatHeader = (props: ChatHeaderProps) => {
    const { children } = props
    return (
        <div className="relative">
            {children}
        </div>
    )
}

type NotificationProps = {
    timeout: number
    readyState: number | null
}

const Notification = (props: NotificationProps) => {
    const { readyState, timeout } = props
    const [isVisible, setIsVisible] = useState(false)
    useEffect(() => {
        const timerId = setTimeout(() => setIsVisible(false), timeout)
        setIsVisible(true)
        return () => {
            clearTimeout(timerId)
        }
    }, [timeout, readyState])

    function renderChildren(): string {
        switch (readyState) {
            case WebSocket.OPEN:
                return 'Connected'
            case WebSocket.CONNECTING:
                return 'Connecting'
            case WebSocket.CLOSING || WebSocket.CLOSED:
                return 'Disconnected'
            default:
                return 'Failed to connect'
        }
    }

    return (
        <div className='p-2 absolute -top-1/4 w-full'>
            <div className={`w-full p-2 rounded-md text-center ease-in-out bg-zinc-700 text-white motion-reduce:transition-none transition-all text-opacity-0` + (isVisible ? ' translate-y-20 text-opacity-100' : ' text-opacity-0')}>{renderChildren()}</div >
        </div>
    )
}

export default ChatWindow

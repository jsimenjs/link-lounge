import { MutableRefObject, PropsWithChildren, SetStateAction, useEffect, useRef, useState } from "react";
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
    const timeoutId = useRef<number | null>(null)
    const connectionAttempt = useRef(0)

    function connect(wsRef: MutableRefObject<WebSocket | null>, roomId: string) {
        const host = import.meta.env.DEV ? 'localhost:8080' : location.host
        const ws = new WebSocket(`ws://${host}/${bytesToBase64(new TextEncoder().encode(roomId))}/ws`);
        wsRef.current = ws
        wsRef.current.onmessage = (event) => {
            const chatEvent: ChatEvent = JSON.parse(event.data)
            console.log(chatEvent)
            setChatHistory(chatHistory => chatHistory.concat(chatEvent))
        }

        wsRef.current.onopen = () => {
            if (timeoutId.current) {
                clearTimeout(timeoutId.current)
                timeoutId.current = null
                connectionAttempt.current = 0
            }

            const chatEvent: ChatEvent = { type: "status", payload: 'Connected.' }
            setChatHistory(chatHistory => chatHistory.concat(chatEvent))
        }

        wsRef.current.onclose = () => {
            const chatEvent: ChatEvent = { type: "status", payload: `Connection closed.` + (connectionAttempt.current > 0 ? ` Reconnecting in ${3 * 2 ** connectionAttempt.current} seconds` : ``) }
            if (connectionAttempt.current !== 0) setChatHistory(chatHistory => chatHistory.concat(chatEvent))
            timeoutId.current = setTimeout(() => connect(wsRef, roomId), 3000 * 2 ** connectionAttempt.current)
            connectionAttempt.current++
        }

        wsRef.current.onerror = () => {
        }

        setWs(ws)
    }

    useEffect(() => {
        console.log('ws useEffect triggered')
        if (roomId === "") { return }

        if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED || wsRef.current.readyState === WebSocket.CLOSING) {
            connect(wsRef, roomId)
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

    useEffect(() => {
        setChatHistory([])
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

export default ChatWindow

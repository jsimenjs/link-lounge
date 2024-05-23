import { SetStateAction } from "react"

export type ChatEvent = {
    type: string
    payload: string
}


export type ChatEventRouterProps = {
    chatEvent: ChatEvent
}


export type ChatMessageProps = {
    message: string
}

export type ChatWindowProps = {
    chatHistory: ChatEvent[]
    ws: WebSocket | null
    setRoomId: React.Dispatch<SetStateAction<string>>
}

export type ChatHistoryProps = {
    chatHistory: ChatEvent[]
}

export type MessageFormProps = {
    ws: WebSocket | null
}

export type NavigationFormProps = {
    setRoomId: React.Dispatch<SetStateAction<string>>
}


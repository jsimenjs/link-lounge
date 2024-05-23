import { FormEvent, useState } from "react"
import { ChatEvent, MessageFormProps } from "../types"

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

export default MessageForm

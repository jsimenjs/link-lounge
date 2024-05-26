import { FormEvent, useState } from "react"
import { MessageFormProps } from "../types"
import { sendMessage } from "../api"

const MessageForm = (props: MessageFormProps) => {
    const { ws } = props
    const [message, setMessage] = useState("")

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()
        sendMessage(message, ws)
        setMessage("")
    }

    return (
        <form id="message-form" onSubmit={(e) => submitHandler(e)} className='flex flex-row gap-2 w-full bg-zinc-800 text-white rounded-lg p-2'>
            <input type="text" placeholder='Type a message' value={message} onChange={(e) => { setMessage(e.target.value) }} className='p-1 bg-zinc-800  placeholder:italic rounded-lg bg-inherit w-full' />
            <button type="submit" className='bg-zinc-600 rounded-3xl text-white p-2'>
                <SendSVG />
            </button>
        </form >
    )
}

const SendSVG = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-zinc-400">
            <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
        </svg>
    )
}

export default MessageForm

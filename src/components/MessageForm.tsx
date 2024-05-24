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
        <form id="message-form" onSubmit={(e) => submitHandler(e)} className='flex flex-row w-full bg-zinc-700 p-2 text-lg rounded-lg'>
            <input type="text" placeholder='Type a message' value={message} onChange={(e) => { setMessage(e.target.value) }} className='p-1 bg-zinc-800  placeholder:italic rounded-lg rounded-r-none bg-inherit w-full' />
            <button type="submit" className='p-0.5 bg-zinc-900 rounded-r-lg text-white px-2'>Send</button>
        </form >
    )
}

export default MessageForm

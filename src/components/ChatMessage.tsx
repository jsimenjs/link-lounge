import { ChatMessageProps } from "../types"

const ChatMessage = (props: ChatMessageProps) => {
    const { senderId, message } = props
    return (
        <div className="p-1 hover:bg-zinc-700 rounded-md flex gap-2">
            <p className="opacity-50">{senderId}:</p>
            <p>{message}</p>
        </div>
    )
}

export default ChatMessage

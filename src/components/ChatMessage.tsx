import { ChatMessageProps } from "../types"

const ChatMessage = (props: ChatMessageProps) => {
    const { message } = props
    return (
        <div className="p-1 hover:bg-zinc-700 rounded-md">
            <p>{message}</p>
        </div>
    )
}

export default ChatMessage

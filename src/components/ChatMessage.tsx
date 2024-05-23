import { ChatMessageProps } from "../types"

const ChatMessage = (props: ChatMessageProps) => {
    const { message } = props
    return (
        <p>{message}</p>
    )
}

export default ChatMessage

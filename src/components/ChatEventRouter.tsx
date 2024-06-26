import { ChatEventRouterProps } from "../types"
import ChatMessage from "./ChatMessage"

const ChatEventRouter = (props: ChatEventRouterProps) => {
    const { chatEvent } = props
    if (chatEvent.type === 'user-event') {
        return <ChatMessage senderId={chatEvent.senderId} message={chatEvent.payload} />

    }
    if (chatEvent.type === 'status') {
        return (
            <div className='text-center text-zinc-400 italic'>
                {chatEvent.payload}
            </div>
        )
    }
    return (
        <></>
    )
}

export default ChatEventRouter

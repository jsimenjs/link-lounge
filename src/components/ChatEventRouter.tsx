import { ChatEventRouterProps } from "../types"
import ChatMessage from "./ChatMessage"

const ChatEventRouter = (props: ChatEventRouterProps) => {
    const { chatEvent } = props
    if (chatEvent.type === 'user-event') {
        return <ChatMessage message={chatEvent.payload} />

    }
    if (chatEvent.type === 'status') {
        return (
            <div className='bg-sky-500 rounded-md p-0.5 px-1 flex items-center'>
                <div className='grow'>
                    <ChatMessage message={chatEvent.payload} />
                </div>
                <span className='italic opacity-50'>
                    #{chatEvent.type}
                </span>
            </div>
        )
    }
    return (
        <></>
    )
}

export default ChatEventRouter

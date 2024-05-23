import { ChatEventRouterProps } from "../types"
import ChatMessage from "./ChatMessage"

const ChatEventRouter = (props: ChatEventRouterProps) => {
    const { chatEvent } = props
    if (chatEvent.type === 'user-event') {
        return <ChatMessage message={chatEvent.payload} />

    }
    if (chatEvent.type === 'status') {
        return (
            <div className='bg-orange-200 rounded-md p-0.5 flex flex-row'>
                <div className='w-full'>
                    <ChatMessage message={chatEvent.payload} />
                </div>
                <div className='italic opacity-50'>
                    {chatEvent.type}
                </div>
            </div>
        )
    }
    return (
        <></>
    )
}

export default ChatEventRouter

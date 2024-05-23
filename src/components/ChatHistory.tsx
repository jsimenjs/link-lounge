import { ChatEvent, ChatHistoryProps } from "../types"
import ChatEventRouter from "./ChatEventRouter"

const ChatHistory = (props: ChatHistoryProps) => {
    const { chatHistory } = props
    return (
        <div id="chat-history" className='h-0 overflow-scroll grow flex flex-col-reverse'>
            <div className='flex flex-col gap-1 text-white'>
                {
                    chatHistory.map((chatEvent: ChatEvent, index: number) => {
                        return <ChatEventRouter key={index} chatEvent={chatEvent} />
                    })
                }
            </div>
        </div>
    )
}

export default ChatHistory

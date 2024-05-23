import { ChatWindowProps } from "../types"
import ChatHistory from "./ChatHistory"
import MessageForm from "./MessageForm"
import NavigationForm from "./NavigationForm"

const ChatWindow = (props: ChatWindowProps) => {
    const { chatHistory, ws, setRoomId } = props
    return (
        <div id="chat-window" className='flex flex-col gap-1 grow'>
            <NavigationForm setRoomId={setRoomId} />
            <ChatHistory chatHistory={chatHistory} />
            <MessageForm ws={ws} />
        </div>
    )
}

export default ChatWindow

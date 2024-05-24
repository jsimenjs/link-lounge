import './App.css'
import ChatWindow from './components/ChatWindow';

function App() {
    return (
        <div className='h-full flex flex-col gap-2 p-4 bg-zinc-800'>
            <h1 className='text-5xl text-white'>Chat</h1>
            <ChatWindow />
        </div>
    )
}

export default App

import { useAuth0 } from '@auth0/auth0-react';
import './App.css'
import ChatWindow from './components/ChatWindow';
import LoginButton from './components/LoginButton';
import UserMenuButton from './components/UserMenuButton';
import { useRef } from 'react';

function App() {
    const { isAuthenticated, isLoading } = useAuth0();
    const lastClickedLocation = useRef<{ x: number, y: number }>()

    return (
        <div className='h-full flex flex-col gap-2 p-4 bg-zinc-800' onClick={(e) => lastClickedLocation.current = { x: e.pageX, y: e.pageY }}>
            <Header isAuthenticated={isAuthenticated} isLoading={isLoading} />
            <ChatWindow />
        </div>
    )
}

type HeaderProps = {
    isAuthenticated: boolean
    isLoading: boolean
}

const Header = (props: HeaderProps) => {
    const { isAuthenticated, isLoading } = props
    return (
        <div className='flex items-center'>
            <h1 className='text-5xl text-white'>Chat</h1>
            <div className='flex grow justify-end'>
                {!isLoading && (isAuthenticated ? <UserMenuButton /> : <LoginButton />)}
            </div>
        </div>
    )
}

export default App

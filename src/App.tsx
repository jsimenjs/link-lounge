import { useAuth0 } from '@auth0/auth0-react';
import './App.css'
import ChatWindow from './components/ChatWindow';
import LoginButton from './components/LoginButton';
import UserMenuButton from './components/UserMenuButton';

function App() {
    const { isAuthenticated, isLoading } = useAuth0();

    return (
        <div className='h-full flex flex-col gap-2 p-4 bg-zinc-800'>
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
            <h1 className='text-3xl text-white font-mono'>LinkLounge</h1>
            <div className='flex grow justify-end'>
                {!isLoading && (isAuthenticated ? <UserMenuButton /> : <LoginButton />)}
            </div>
        </div>
    )
}

export default App

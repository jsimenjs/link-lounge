import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <button className='bg-zinc-700 text-white rounded-lg p-1 px-2' onClick={() => loginWithRedirect()}>Log In</button>;
};

export default LoginButton;

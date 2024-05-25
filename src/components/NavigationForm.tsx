import { FormEvent, useState } from "react";
import { NavigationFormProps } from "../types";

const NavigationForm = (props: NavigationFormProps) => {
    const { setRoomId } = props;
    const [destination, setDestination] = useState("general");

    const navigateHandler = (e: FormEvent) => {
        e.preventDefault()
        setRoomId(destination)
    }

    return (
        <form id="navigation-form" onSubmit={navigateHandler} className='z-10 flex flex-row text-white'>
                <input id="destination" type="text" placeholder="Paste a URL" onChange={(e) => { setDestination(e.target.value) }} className='w-full z-10 placeholder:italic bg-zinc-800 p-1 rounded-lg rounded-r-none'></input>
                <button className='bg-zinc-900 z-10 p-0.5 px-2 text-white rounded-r-lg'>Go</button>
        </form>
    )
}

export default NavigationForm

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
        <form id="navigation-form" onSubmit={navigateHandler} className='flex flex-row'>
            <div className='flex w-full bg-zinc-700 p-2 rounded-lg text-white text-lg'>
                <input id="destination" type="text" placeholder="Paste a URL" onChange={(e) => { setDestination(e.target.value) }} className='w-full placeholder:italic bg-zinc-800 p-1 rounded-lg rounded-r-none'></input>
                <button className='bg-zinc-900 p-0.5 px-2 text-white rounded-r-lg'>Go</button>
            </div>
        </form>
    )
}

export default NavigationForm

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
            <div className='flex rounded-lg overflow-clip bg-zinc-200 p-1 w-full'>
                <input id="destination" type="text" placeholder="Paste a URL" onChange={(e) => { setDestination(e.target.value) }} className='w-full bg-inherit'></input>
                <button className='border-l border-white p-0.5 px-2'>Go</button>
            </div>
        </form>
    )
}

export default NavigationForm

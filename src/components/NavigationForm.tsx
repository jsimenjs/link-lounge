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
        <form id="navigation-form" onSubmit={navigateHandler} className='z-10 bg-zinc-800 rounded-lg p-2 flex flex-row gap-2 text-white'>
            <input id="destination" type="text" placeholder="Paste a URL" onChange={(e) => { setDestination(e.target.value) }} className='w-full z-10 placeholder:italic bg-inherit p-1 rounded-lg'></input>
            <button className='bg-zinc-700 z-10 p-2 text-white rounded-3xl'>
                <SearchSVG />
            </button>
        </form>
    )
}

const SearchSVG = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-zinc-300" >
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
        </svg >

    )
}

export default NavigationForm

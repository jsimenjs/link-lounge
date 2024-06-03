import { useAuth0 } from "@auth0/auth0-react"
import { useState } from "react"
import LogoutButton from "./LogoutButton"

const UserMenuButton = () => {
    const { user } = useAuth0()
    const [isExpanded, setIsExpanded] = useState(false)

    function toggle() {
        setIsExpanded(!isExpanded)
    }

    function collapse() {
        setIsExpanded(false)
    }

    if (!user) return null

    return (
        <div className="text-white flex flex-col">
            {isExpanded && (<div onMouseDown={collapse} className="absolute z-10 top-0 left-0 w-full h-full"></div>)}
            <button className="bg-zinc-700 rounded-lg p-1 px-2 flex gap-1 items-center" onClick={toggle}>{user.nickname}<Chevron isExpanded={isExpanded} /></button>
            {isExpanded && (
                <div className="absolute z-10 right-4 top-16 bg-zinc-700 w-fit rounded-lg p-1">
                    <ul className="text-right">
                        <li className="italic">
                            {user.email}
                        </li>
                        <li>
                            <LogoutButton />
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}

type ChevronProps = {
    isExpanded: boolean
}

const Chevron = (props: ChevronProps) => {
    const { isExpanded } = props
    if (isExpanded) {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                <path fillRule="evenodd" d="M9.47 6.47a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 1 1-1.06 1.06L10 8.06l-3.72 3.72a.75.75 0 0 1-1.06-1.06l4.25-4.25Z" clipRule="evenodd" />
            </svg>
        )
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
    )
}

export default UserMenuButton

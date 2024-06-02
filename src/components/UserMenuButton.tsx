import { useAuth0 } from "@auth0/auth0-react"
import React, { useEffect, useRef, useState } from "react"
import LogoutButton from "./LogoutButton"

const UserMenuButton = () => {
    const { isAuthenticated, isLoading, user } = useAuth0()
    const [isExpanded, setIsExpanded] = useState(false)
    function expand() {
        setIsExpanded(true)
    }

    function collapse() {
        setIsExpanded(false)
    }

    return (
        <div onPointerLeave={collapse} className="relative text-white">
            <button className="bg-zinc-700 rounded-lg p-1 px-2" onClick={expand}>{user.nickname}</button>
            {isExpanded && (
                <div className="absolute bg-zinc-700">
                    <ul>
                        <li>
                            <LogoutButton />
                        </li>
                    </ul>
                </div>
            )}
        </div>
    )
}

export default UserMenuButton

import { createContext, FC, useContext, useState } from "react"
import useLocalStorage from "src/common/hooks/useLocalStorage"

interface UserContextProps {
    name: string | undefined
    setName: (name: string) => any
}
export const UserContext = createContext<UserContextProps | undefined>(
    undefined,
)
export const UserProvider: FC = ({ children }) => {
    const [name, setName] = useLocalStorage<string | undefined>(
        "name",
        undefined,
    )

    const value = { name, setName }
    return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUserContext = () => {
    const context = useContext(UserContext)
    if (context === undefined)
        throw new Error("useUserContext must be within UserProvider")
    return context
}

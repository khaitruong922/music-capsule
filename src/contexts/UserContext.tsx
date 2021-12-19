import { createContext, FC, useContext, useState } from 'react'

interface UserContextProps {
	name: string | null
	setName: (name: string) => any
}
export const UserContext = createContext<UserContextProps | undefined>(
	undefined,
)
export const UserProvider: FC = ({ children }) => {
	const [name, setName] = useState(localStorage.getItem('name'))

	const value = { name, setName }
	return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUserContext = () => {
	const context = useContext(UserContext)
	if (context === undefined)
		throw new Error('useUserContext must be within UserProvider')
	return context
}

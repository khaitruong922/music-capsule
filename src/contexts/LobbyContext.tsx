import { createContext, FC, useContext, useState } from 'react'

interface LobbyContextProps {
	joinedLobby: boolean
	setJoinedLobby: (b: boolean) => any
}
export const LobbyContext = createContext<LobbyContextProps | undefined>(
	undefined,
)
export const LobbyProvider: FC = ({ children }) => {
	const [joinedLobby, setJoinedLobby] = useState<boolean>(false)

	const value = { joinedLobby, setJoinedLobby }
	return <LobbyContext.Provider value={value}>{children}</LobbyContext.Provider>
}

export const useLobbyContext = () => {
	const context = useContext(LobbyContext)
	if (context === undefined)
		throw new Error('useLobbyContext must be within LobbyProvider')
	return context
}

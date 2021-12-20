import { createContext, FC, useContext, useState } from 'react'
import { Rooms, RoomWithUsers } from 'src/common/core/lobby/lobby.interface'
import LobbyService from 'src/common/core/lobby/lobby.service'

interface LobbyContextProps {
	joinedLobby: boolean
	setJoinedLobby: (b: boolean) => any
	rooms: Rooms
	addRoom: (room: RoomWithUsers) => any
	deleteRoom: (roomId: string) => any
	clearRooms: () => any
	fetchRooms: () => any
}

export const LobbyContext = createContext<LobbyContextProps | undefined>(
	undefined,
)
export const LobbyProvider: FC = ({ children }) => {
	const [joinedLobby, setJoinedLobby] = useState<boolean>(false)
	const [rooms, setRooms] = useState<Rooms>({})

	const addRoom = (room: RoomWithUsers) => {
		setRooms((rooms) => ({ ...rooms, [room.id]: room }))
	}

	const deleteRoom = (roomId: string) => {
		setRooms((rooms) => {
			const newRooms = { ...rooms }
			delete newRooms[roomId]
			return newRooms
		})
	}

	const clearRooms = () => {
		setRooms({})
	}

	const fetchRooms = async () => {
		const fetchedRooms = await LobbyService.getRooms()
		setRooms(fetchedRooms)
	}

	const value = {
		joinedLobby,
		setJoinedLobby,
		rooms,
		addRoom,
		deleteRoom,
		fetchRooms,
		clearRooms,
	}
	return <LobbyContext.Provider value={value}>{children}</LobbyContext.Provider>
}

export const useLobbyContext = () => {
	const context = useContext(LobbyContext)
	if (context === undefined)
		throw new Error('useLobbyContext must be within LobbyProvider')
	return context
}

import { createContext, FC, useContext, useState } from "react"
import {
    LobbyRoomResponse,
    LobbyRoomsResponse,
} from "src/common/core/lobby/lobby.interface"
import LobbyService from "src/common/core/lobby/lobby.service"

interface LobbyContextProps {
    joinedLobby: boolean
    setJoinedLobby: (b: boolean) => any
    rooms: LobbyRoomsResponse
    addRoom: (room: LobbyRoomResponse) => any
    deleteRoom: (roomId: string) => any
    clearRooms: () => any
    fetchRooms: () => any
    updateRoom: (roomId: string, room: Partial<LobbyRoomResponse>) => any
}

export const LobbyContext = createContext<LobbyContextProps | undefined>(
    undefined,
)
export const LobbyProvider: FC = ({ children }) => {
    const [joinedLobby, setJoinedLobby] = useState<boolean>(false)

    const [rooms, setRooms] = useState<LobbyRoomsResponse>({})

    const addRoom = (room: LobbyRoomResponse) => {
        setRooms((rooms) => ({ ...rooms, [room.id]: room }))
    }

    const deleteRoom = (roomId: string) => {
        setRooms((rooms) => {
            const newRooms = { ...rooms }
            delete newRooms[roomId]
            return newRooms
        })
    }

    const updateRoom = (roomId: string, room: Partial<LobbyRoomResponse>) => {
        setRooms((rooms) => {
            // Override room field
            const newRoom = { ...rooms[roomId], ...room }
            return { ...rooms, [roomId]: newRoom }
        })
    }

    const clearRooms = () => {
        setRooms({})
    }

    const fetchRooms = async () => {
        const lobby = await LobbyService.getLobby()
        setRooms(lobby.rooms)
    }

    const value = {
        joinedLobby,
        setJoinedLobby,
        rooms,
        addRoom,
        deleteRoom,
        fetchRooms,
        clearRooms,
        updateRoom,
    }
    return (
        <LobbyContext.Provider value={value}>{children}</LobbyContext.Provider>
    )
}

export const useLobbyContext = () => {
    const context = useContext(LobbyContext)
    if (context === undefined)
        throw new Error("useLobbyContext must be within LobbyProvider")
    return context
}

import { createContext, FC, useCallback, useContext, useState } from "react"
import {
    LobbyRoomResponse,
    LobbyRoomsResponse,
} from "src/common/core/lobby/lobby.interface"
import LobbyService from "src/common/core/lobby/lobby.service"

interface LobbyContextProps {
    joinedLobby: boolean
    setJoinedLobby: (b: boolean) => void
    rooms: LobbyRoomsResponse
    addRoom: (room: LobbyRoomResponse) => void
    deleteRoom: (roomId: string) => void
    clearRooms: () => void
    fetchRooms: () => Promise<void>
    updateRoom: (roomId: string, room: Partial<LobbyRoomResponse>) => void
}

export const LobbyContext = createContext<LobbyContextProps | undefined>(
    undefined,
)
export const LobbyProvider: FC = ({ children }) => {
    const [joinedLobby, setJoinedLobby] = useState<boolean>(false)

    const [rooms, setRooms] = useState<LobbyRoomsResponse>({})

    const addRoom = useCallback((room: LobbyRoomResponse) => {
        setRooms((rooms) => ({ ...rooms, [room.id]: room }))
    }, [])

    const deleteRoom = useCallback((roomId: string) => {
        setRooms((rooms) => {
            const newRooms = { ...rooms }
            delete newRooms[roomId]
            return newRooms
        })
    }, [])

    const updateRoom = useCallback(
        (roomId: string, room: Partial<LobbyRoomResponse>) => {
            setRooms((rooms) => {
                // Override room field
                const newRoom = { ...rooms[roomId], ...room }
                return { ...rooms, [roomId]: newRoom }
            })
        },
        [],
    )

    const clearRooms = useCallback(() => {
        setRooms({})
    }, [])

    const fetchRooms = useCallback(async () => {
        const lobby = await LobbyService.getLobby()
        setRooms(lobby.rooms)
    }, [])

    const value: LobbyContextProps = {
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

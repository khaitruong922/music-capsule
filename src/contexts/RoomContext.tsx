import { useBoolean } from "@chakra-ui/react"
import {
    createContext,
    FC,
    MutableRefObject,
    useCallback,
    useContext,
    useRef,
    useState,
} from "react"
import {
    Room,
    Users,
    UserWithSocketId,
} from "src/common/core/lobby/lobby.interface"
import LobbyService from "src/common/core/lobby/lobby.service"
import { Song } from "src/common/core/stream/stream.interface"
import useLocalStorage from "src/common/hooks/useLocalStorage"

interface RoomContextProps {
    room?: Room
    queue: Song[]
    users: Users
    addSong: (song: Song) => void
    nextSong: () => void
    fetchRoom: (roomId: string) => Promise<void>
    leaveRoom: () => void
    addUser: (user: UserWithSocketId) => void
    deleteUser: (socketId: string) => void
    loading: boolean
    playingRef: MutableRefObject<boolean>
    volume: number
    setVolume: (volume: number) => void
    currentTime: number
    setCurrentTime: (time: number) => void
    muted: boolean
    setMuted: (muted: boolean) => void
    toggleMuted: () => void
    setQueue: (queue: Song[]) => void
}

export const RoomContext = createContext<RoomContextProps | undefined>(
    undefined,
)
export const RoomProvider: FC = ({ children }) => {
    const [room, setRoom] = useState<Room>()
    const [queue, setQueue] = useState<Song[]>([])
    const [users, setUsers] = useState<Users>({})
    const [loading, setLoading] = useState(true)
    const [volume, setVolume] = useLocalStorage("volume", 0.5)
    const [muted, setMuted] = useBoolean(false)
    const playingRef = useRef<boolean>(false)
    const [currentTime, setCurrentTime] = useState(0)

    const leaveRoom = useCallback(() => {
        setRoom(undefined)
        setQueue([])
        setUsers({})
        setLoading(true)
        setCurrentTime(0)
        playingRef.current = false
    }, [])

    const fetchRoom = useCallback(async (roomId: string) => {
        try {
            const { id, name, queue, users } = await LobbyService.getRoom(
                roomId,
            )
            setRoom({ id, name })
            setQueue(queue)
            setUsers(users)
        } catch (e) {
            setRoom(undefined)
        } finally {
            setLoading(false)
        }
    }, [])

    const addSong = useCallback((song: Song) => {
        setQueue((queue) => [...queue, song])
    }, [])

    const nextSong = useCallback(() => {
        setQueue((queue) => {
            const newQueue = [...queue]
            newQueue.shift()
            return newQueue
        })
    }, [])

    const addUser = useCallback((user: UserWithSocketId) => {
        setUsers((users) => ({ ...users, [user.socketId]: user }))
    }, [])

    const deleteUser = useCallback((socketId: string) => {
        setUsers((users) => {
            const newRooms = { ...users }
            delete newRooms[socketId]
            return newRooms
        })
    }, [])

    const _setMuted = useCallback(
        (muted: boolean) => {
            if (muted) setMuted.on()
            else setMuted.off()
        },
        [setMuted],
    )

    const value: RoomContextProps = {
        room,
        queue,
        addSong,
        nextSong,
        fetchRoom,
        loading,
        users,
        leaveRoom,
        playingRef,
        addUser,
        deleteUser,
        volume,
        setVolume,
        currentTime,
        setCurrentTime,
        muted,
        setMuted: _setMuted,
        toggleMuted: setMuted.toggle,
        setQueue,
    }

    return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
}

export const useRoomContext = () => {
    const context = useContext(RoomContext)
    if (context === undefined)
        throw new Error("useRoomContext must be within RoomProvider")
    return context
}

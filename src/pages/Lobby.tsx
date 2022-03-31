import {
    Box,
    Button,
    chakra,
    Flex,
    GridItem,
    Input,
    SimpleGrid,
    Text,
} from "@chakra-ui/react"
import axios from "axios"
import { FC, FormEvent, useEffect, useState } from "react"
import {
    CREATE_ROOM,
    JOIN_CREATED_ROOM,
    ROOM_CREATED,
    ROOM_DELETED,
    ROOM_USER_COUNT_CHANGED,
} from "src/common/constants/lobby.event"
import { ROOM_SONG_CHANGED } from "src/common/constants/stream.event"
import { LobbyRoomResponse } from "src/common/core/lobby/lobby.interface"
import LobbyService from "src/common/core/lobby/lobby.service"
import { Song } from "src/common/core/stream/stream.interface"
import useInput from "src/common/hooks/useInput"
import useNavigateRoom from "src/common/hooks/useNavigateRoom"
import { filterRoomName, ROOM_NAME_MAX_LENGTH } from "src/common/utils/string"
import RoomCard from "src/components/lobby/RoomCard"
import AppDivider from "src/components/shared/AppDivider"
import { useErrorToast } from "src/components/shared/toast"
import { useLobbyContext } from "src/contexts/LobbyContext"
import { socket, useSocket } from "src/contexts/SocketContext"
import { useUserContext } from "src/contexts/UserContext"

const CreateRoomForm: FC = () => {
    const socket = useSocket()
    const [loading, setLoading] = useState(false)

    const { value: roomNameInput, onInput: onRoomNameInput } = useInput("")
    const createRoom = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        socket.emit(CREATE_ROOM, { roomName: filterRoomName(roomNameInput) })
    }
    return (
        <chakra.form onSubmit={createRoom} display="flex" mt={4}>
            <Input
                value={roomNameInput}
                onInput={onRoomNameInput}
                placeholder="Room name"
                borderColor="purple.light"
                focusBorderColor="purple.main"
                w="250px"
                mr={2}
                isRequired
                maxLength={ROOM_NAME_MAX_LENGTH}
            />
            <Button
                w="150px"
                _focus={{ boxShadow: "none" }}
                colorScheme={"purple"}
                type="submit"
                isLoading={loading}
                fontSize={["sm", "sm", "sm", "md"]}
            >
                Create room
            </Button>
        </chakra.form>
    )
}

const JoinRoomForm: FC = () => {
    const { value: roomIdInput, onInput: onRoomIdInput } = useInput("")
    const [loading, setLoading] = useState(false)
    const navigateRoom = useNavigateRoom()
    const errorToast = useErrorToast()

    const joinRoom = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const room = await LobbyService.getRoom(roomIdInput)
            navigateRoom(roomIdInput)
        } catch (e) {
            if (axios.isAxiosError(e)) {
                errorToast({
                    title: e.response?.data.message,
                })
            }
        } finally {
            setLoading(false)
        }
    }
    return (
        <chakra.form onSubmit={joinRoom} display="flex" my={2}>
            <Input
                placeholder="Room ID"
                borderColor="green.light"
                focusBorderColor="green.main"
                value={roomIdInput}
                onInput={onRoomIdInput}
                w="250px"
                mr={2}
                isRequired
            />
            <Button
                w="150px"
                _focus={{ boxShadow: "none" }}
                colorScheme={"whatsapp"}
                type="submit"
                isLoading={loading}
                fontSize={["sm", "sm", "sm", "md"]}
            >
                Join room
            </Button>
        </chakra.form>
    )
}

interface RoomSongChangedPayload {
    roomId: string
    song: Song
}

interface RoomUserCountChangedPayload {
    roomId: string
    userCount: number
}

const RoomList: FC = () => {
    const { fetchRooms, rooms, addRoom, deleteRoom, clearRooms, updateRoom } =
        useLobbyContext()
    useEffect(() => {
        const roomsCreated = ({ room }: { room: LobbyRoomResponse }) => {
            addRoom(room)
        }
        const roomsDeleted = ({ roomId }: { roomId: string }) => {
            deleteRoom(roomId)
        }
        const roomSongChanged = ({ roomId, song }: RoomSongChangedPayload) => {
            // console.log('roomSongChanged')
            updateRoom(roomId, { nowPlaying: song })
        }
        const roomUserCountChanged = ({
            roomId,
            userCount,
        }: RoomUserCountChangedPayload) => {
            updateRoom(roomId, { userCount })
        }

        const f = async () => {
            await fetchRooms()
            socket.on(ROOM_CREATED, roomsCreated)
            socket.on(ROOM_DELETED, roomsDeleted)
            socket.on(ROOM_SONG_CHANGED, roomSongChanged)
            socket.on(ROOM_USER_COUNT_CHANGED, roomUserCountChanged)
        }
        f()
        return () => {
            clearRooms()
            socket.off(ROOM_CREATED, roomsCreated)
            socket.off(ROOM_DELETED, roomsDeleted)
            socket.off(ROOM_SONG_CHANGED, roomSongChanged)
            socket.off(ROOM_USER_COUNT_CHANGED, roomUserCountChanged)
        }
    }, [])
    return (
        <SimpleGrid p={8} gap={2} columns={[1, 1, 2, 2, 3]}>
            {Object.values(rooms).map((room) => {
                return <RoomCard key={room.id} room={room} />
            })}
        </SimpleGrid>
    )
}

const Lobby: FC = () => {
    const { name } = useUserContext()
    const socket = useSocket()
    const navigateRoom = useNavigateRoom()

    useEffect(() => {
        const joinCreatedRoom = ({ roomId }: { roomId: string }) => {
            navigateRoom(roomId)
        }
        socket.on(JOIN_CREATED_ROOM, joinCreatedRoom)
        return () => {
            socket.off(JOIN_CREATED_ROOM, joinCreatedRoom)
        }
    }, [])

    return (
        <Box h="100%">
            <SimpleGrid
                borderTop={"1px"}
                borderTopColor={"gray.700"}
                h="100%"
                flex={1}
                columns={8}
                bgColor={"gray.900"}
            >
                <GridItem
                    color="white"
                    p={8}
                    colSpan={[8, 4, 3, 3, 2]}
                    borderRightWidth={["0px", "1px"]}
                    borderRightColor={"gray.700"}
                    borderBottomWidth={["1px", "0px"]}
                    borderBottomColor={"gray.700"}
                >
                    <Flex justify="center" direction="column">
                        <Text fontSize="2xl" noOfLines={2} fontWeight={600}>
                            Welcome, {name}
                        </Text>
                    </Flex>
                    <CreateRoomForm />
                    <JoinRoomForm />
                </GridItem>
                <GridItem
                    h={"100%"}
                    overflowY={"auto"}
                    colSpan={[8, 4, 5, 5, 6]}
                >
                    <RoomList />
                </GridItem>
            </SimpleGrid>
        </Box>
    )
}

export default Lobby

import {
	Button,
	chakra,
	Flex,
	GridItem,
	Input,
	SimpleGrid,
	Text,
} from '@chakra-ui/react'
import axios from 'axios'
import { FC, FormEvent, useEffect, useState } from 'react'
import {
	CREATE_ROOM,
	JOIN_CREATED_ROOM,
	ROOM_CREATED,
	ROOM_DELETED,
} from 'src/common/constants/lobby.event'
import {
	LobbyRoomResponse,
	RoomResponse,
} from 'src/common/core/lobby/lobby.interface'
import LobbyService from 'src/common/core/lobby/lobby.service'
import useInput from 'src/common/hooks/useInput'
import useNavigateRoom from 'src/common/hooks/useNavigateRoom'
import RoomCard from 'src/components/lobby/RoomCard'
import { useErrorToast } from 'src/components/shared/toast'
import { useLobbyContext } from 'src/contexts/LobbyContext'
import { socket, useSocket } from 'src/contexts/SocketContext'
import { useUserContext } from 'src/contexts/UserContext'

const CreateRoomForm: FC = () => {
	const socket = useSocket()
	const [loading, setLoading] = useState(false)

	const { value: roomNameInput, onInput: onRoomNameInput } = useInput('')
	const createRoom = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		socket.emit(CREATE_ROOM, { roomName: roomNameInput })
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
			/>
			<Button
				w="150px"
				_focus={{ boxShadow: 'none' }}
				colorScheme={'purple'}
				type="submit"
				isLoading={loading}
			>
				Create room
			</Button>
		</chakra.form>
	)
}

const JoinRoomForm: FC = () => {
	const { value: roomIdInput, onInput: onRoomIdInput } = useInput('')
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
				_focus={{ boxShadow: 'none' }}
				colorScheme={'whatsapp'}
				type="submit"
				isLoading={loading}
			>
				Join room
			</Button>
		</chakra.form>
	)
}

const RoomList: FC = () => {
	const { fetchRooms, rooms, addRoom, deleteRoom, clearRooms } =
		useLobbyContext()
	useEffect(() => {
		const roomsCreated = ({ room }: { room: LobbyRoomResponse }) => {
			addRoom(room)
		}
		const roomsDeleted = ({ roomId }: { roomId: string }) => {
			deleteRoom(roomId)
		}
		const f = async () => {
			await fetchRooms()
			socket.on(ROOM_CREATED, roomsCreated)
			socket.on(ROOM_DELETED, roomsDeleted)
		}
		f()
		return () => {
			clearRooms()
			socket.off(ROOM_CREATED, roomsCreated)
			socket.off(ROOM_DELETED, roomsDeleted)
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
	})
	return (
		<Flex flex={1} direction="column">
			<SimpleGrid flex={1} gap={8} columns={8}>
				<GridItem p={8} colSpan={[8, 4, 3, 3, 2]}>
					<Flex justify="center" direction="column">
						<Text fontSize="2xl" fontWeight={600}>
							Welcome, {name}
						</Text>
						<Text fontSize="lg">Let's enjoy the music together!</Text>
					</Flex>
					<CreateRoomForm />
					<JoinRoomForm />
				</GridItem>
				<GridItem
					h={'100%'}
					style={{}}
					overflowY={'auto'}
					bgColor={'purple.white'}
					colSpan={[8, 4, 5, 5, 6]}
				>
					<RoomList />
				</GridItem>
			</SimpleGrid>
		</Flex>
	)
}

export default Lobby

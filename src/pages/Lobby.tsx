import {
	Button,
	chakra,
	Flex,
	GridItem,
	Input,
	SimpleGrid,
	Text,
} from '@chakra-ui/react'
import { FC, FormEvent, useEffect, useState } from 'react'
import {
	CREATE_ROOM,
	JOIN_CREATED_ROOM,
} from 'src/common/constants/lobby.event'
import LobbyService from 'src/common/core/lobby/lobby.service'
import useInput from 'src/common/hooks/useInput'
import useNavigateRoom from 'src/common/hooks/useNavigateRoom'
import RoomCard from 'src/components/lobby/RoomCard'
import { useErrorToast } from 'src/components/shared/toast'
import { useSocket } from 'src/contexts/SocketContext'
import { useUserContext } from 'src/contexts/UserContext'

interface JoinCreatedRoomDto {
	roomId: string
}

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
			errorToast({
				title: 'Room not found!',
			})
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

const Lobby: FC = () => {
	const { name } = useUserContext()
	const socket = useSocket()
	const navigateRoom = useNavigateRoom()

	useEffect(() => {
		const joinCreatedRoom = ({ roomId }: { roomId: string }) => {
			console.log(roomId)
			navigateRoom(roomId)
		}
		socket.on(JOIN_CREATED_ROOM, joinCreatedRoom)
		return () => {
			socket.off(JOIN_CREATED_ROOM, joinCreatedRoom)
		}
	})
	return (
		<Flex flex={1} direction="column">
			<SimpleGrid p={8} gap={8} columns={4}>
				<GridItem colSpan={[4, 2, null, 2, 1]}>
					<Flex justify="center" direction="column">
						<Text fontSize="2xl" fontWeight={600}>
							Welcome, {name}
						</Text>
						<Text fontSize="lg">Let's enjoy the music together!</Text>
					</Flex>
					<CreateRoomForm />
					<JoinRoomForm />
				</GridItem>
				<GridItem colSpan={[4, 2, null, 2, 3]}>
					<SimpleGrid gap={2} columns={[2, 2, null, 3, 4]}>
						<RoomCard roomId="1" name={'Vocaloid'} />
						<RoomCard roomId="2" name={'Vocaloid'} />
						<RoomCard roomId="3" name={'Vocaloid'} />
					</SimpleGrid>
				</GridItem>
			</SimpleGrid>
		</Flex>
	)
}

export default Lobby

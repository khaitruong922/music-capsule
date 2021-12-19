import {
	Button,
	chakra,
	Flex,
	GridItem,
	Input,
	SimpleGrid,
	Text,
} from '@chakra-ui/react'
import { FC, FormEvent, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	CREATE_ROOM,
	JOIN_LOBBY,
	JOIN_ROOM,
} from 'src/common/constants/lobby.event'
import useInput from 'src/common/hooks/useInput'
import RoomCard from 'src/components/lobby/RoomCard'
import { SocketProvider, useSocket } from 'src/contexts/SocketContext'
import { useUserContext } from 'src/contexts/UserContext'

const Home: FC = () => {
	const { name } = useUserContext()
	const socket = useSocket()
	const navigate = useNavigate()
	const { value: roomNameInput, onInput: onRoomNameInput } = useInput('')
	const { value: roomIdInput, onInput: onRoomIdInput } = useInput('')

	useEffect(() => {
		socket.emit(JOIN_LOBBY, { user: { name } })
		return () => {}
	}, [])

	const createRoom = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		socket.emit(CREATE_ROOM, { roomName: roomNameInput })
	}

	const joinRoom = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		navigate(`/${roomIdInput}`)
	}

	return (
		<SocketProvider>
			<Flex flex={1} direction="column">
				<SimpleGrid p={8} gap={8} columns={4}>
					<GridItem colSpan={[4, 2, null, 2, 1]}>
						<Flex justify="center" direction="column">
							<Text fontSize="2xl" fontWeight={600}>
								Welcome, {name}
							</Text>
							<Text fontSize="lg">Let's enjoy the music together!</Text>
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
								>
									Create room
								</Button>
							</chakra.form>
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
								>
									Join room
								</Button>
							</chakra.form>
						</Flex>
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
		</SocketProvider>
	)
}

export default Home

import { Box, Flex, GridItem, SimpleGrid, Text } from '@chakra-ui/react'
import { FC, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { JOIN_ROOM, LEAVE_ROOM } from 'src/common/constants/lobby.event'
import { useLobbyContext } from 'src/contexts/LobbyContext'
import { useRoomContext } from 'src/contexts/RoomContext'
import { useSocket } from 'src/contexts/SocketContext'
import ChatBox from './ChatBox'
import AddSongForm from './AddSongForm'
import SongList from './SongList'
import SongPlayer from './SongPlayer'
import UserList from './UserList'

const RoomPage: FC = () => {
	const socket = useSocket()
	const { roomId } = useParams()
	const { joinedLobby } = useLobbyContext()
	const { fetchRoom, loading, room, leaveRoom } = useRoomContext()
	const { id: socketId } = socket
	const navigate = useNavigate()

	useEffect(() => {
		return () => {
			leaveRoom()
		}
	}, [])

	useEffect(() => {
		console.log('fetchroom')
		fetchRoom(roomId!)
	}, [roomId])

	useEffect(() => {
		if (loading) return
		if (!joinedLobby) return
		if (!room) {
			navigate('/', { replace: true })
			return
		}
		socket.emit(JOIN_ROOM, { socketId, roomId })
		return () => {
			socket.emit(LEAVE_ROOM, { socketId, roomId })
		}
	}, [loading, joinedLobby])

	if (!room) return <></>
	return (
		<Flex h="100%" p={8} justify="center" direction="column">
			<Text textAlign={'center'} fontSize="2xl" fontWeight={600}>
				{room?.name}
			</Text>
			<Flex mb={6} align="center" justify="center">
				<AddSongForm />
			</Flex>
			<SimpleGrid flex={1} gap={4} columns={3}>
				<GridItem
					h="100%"
					display="flex"
					flexDirection={'column'}
					colSpan={[3, null, null, 2]}
				>
					<SongPlayer />
					<Box h={4} />
					<SongList />
				</GridItem>
				<GridItem colSpan={[3, null, null, 1]}>
					<ChatBox />
					<Box h={4} />
					<UserList />
				</GridItem>
			</SimpleGrid>
		</Flex>
	)
}

export default RoomPage

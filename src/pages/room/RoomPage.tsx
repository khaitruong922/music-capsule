import { Box, Flex, GridItem, SimpleGrid } from '@chakra-ui/react'
import { FC, useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
	JOIN_ROOM,
	LEAVE_ROOM,
	USER_JOIN_ROOM,
	USER_LEAVE_ROOM,
} from 'src/common/constants/lobby.event'
import { UserWithSocketId } from 'src/common/core/lobby/lobby.interface'
import AppDivider from 'src/components/shared/AppDivider'
import { useLobbyContext } from 'src/contexts/LobbyContext'
import { useRoomContext } from 'src/contexts/RoomContext'
import { useSocket } from 'src/contexts/SocketContext'
import AddSongForm from './AddSongForm'
import ChatBox from './ChatBox'
import RoomHeader from './RoomHeader'
import SongList from './SongList'
import SongPlayer from './SongPlayer'

const RoomPage: FC = () => {
	const socket = useSocket()
	const { roomId } = useParams()
	const { joinedLobby } = useLobbyContext()
	const { fetchRoom, loading, room, leaveRoom, addUser, deleteUser } =
		useRoomContext()
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

	useEffect(() => {
		const userJoinRoom = ({ user }: { user: UserWithSocketId }) => {
			console.log('userJoinRoom', user)
			addUser(user)
		}
		const userLeaveRoom = ({ user }: { user: UserWithSocketId }) => {
			deleteUser(user.socketId)
		}
		socket.on(USER_JOIN_ROOM, userJoinRoom)
		socket.on(USER_LEAVE_ROOM, userLeaveRoom)
		return () => {
			socket.off(USER_JOIN_ROOM, userJoinRoom)
			socket.off(USER_LEAVE_ROOM, userLeaveRoom)
		}
	}, [])

	if (!loading && !room) return <Navigate to="/" />
	return (
		<Flex direction="column" h="100%">
			<AppDivider />
			<RoomHeader />
			<AppDivider />
			<SongPlayer />
			<AppDivider />
			<SimpleGrid flex={1} bgColor={'gray.900'} columns={3}>
				<GridItem
					colSpan={[3, null, null, 2]}
					p={6}
					borderRightWidth={['0px', null, null, '1px']}
					borderRightColor={'gray.700'}
					borderBottomWidth={['1px', null, null, '0px']}
					borderBottomColor={'gray.700'}
				>
					<AddSongForm />
					<Box h={2} />
					<SongList />
				</GridItem>
				<GridItem p={6} colSpan={[3, null, null, 1]}>
					<ChatBox />
				</GridItem>
			</SimpleGrid>
		</Flex>
	)
}

export default RoomPage

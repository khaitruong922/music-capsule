import { Flex, Text } from '@chakra-ui/react'
import { FC, useCallback, useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { JOIN_ROOM, LEAVE_ROOM } from 'src/common/constants/lobby.event'
import { RoomWithUsers } from 'src/common/core/lobby/lobby.interface'
import LobbyService from 'src/common/core/lobby/lobby.service'
import { useLobbyContext } from 'src/contexts/LobbyContext'
import { useSocket } from 'src/contexts/SocketContext'

const RoomPage: FC = () => {
	const socket = useSocket()
	const { roomId } = useParams()
	const { joinedLobby } = useLobbyContext()
	const { id: socketId } = socket
	const navigate = useNavigate()
	const [loading, setLoading] = useState(true)
	const [room, setRoom] = useState<RoomWithUsers>()

	const fetchRoom = useCallback(async () => {
		setLoading(true)
		try {
			console.log(roomId)
			const room = await LobbyService.getRoom(roomId!)
			setRoom(room)
		} catch (e) {
			navigate('/', { replace: true })
		} finally {
			setLoading(false)
		}
	}, [roomId])

	useEffect(() => {
		fetchRoom()
	}, [])

	useEffect(() => {
		if (loading) return
		if (!joinedLobby) return
		socket.emit(JOIN_ROOM, { socketId, roomId })
		return () => {
			socket.emit(LEAVE_ROOM, { socketId, roomId })
		}
	}, [loading, joinedLobby])

	if (!loading && !room) return <Navigate to="/" replace={true} />
	return (
		<Flex p={8} justify="center" direction="column">
			<Text fontSize="2xl" fontWeight={600}>
				Room {room?.name}
			</Text>
		</Flex>
	)
}

export default RoomPage

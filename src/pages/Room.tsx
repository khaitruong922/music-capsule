import { Flex, Text } from '@chakra-ui/react'
import { FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { JOIN_ROOM } from 'src/common/constants/lobby.event'
import { SocketProvider, useSocket } from 'src/contexts/SocketContext'

const Room: FC = () => {
	const socket = useSocket()
	const { roomId } = useParams()
	const { id: socketId } = socket
	useEffect(() => {
		socket.emit(JOIN_ROOM, { socketId })
		return () => {}
	}, [])
	return (
		<SocketProvider>
			<Flex p={8} justify="center" direction="column">
				<Text fontSize="2xl" fontWeight={600}>
					Room {roomId}
				</Text>
			</Flex>
		</SocketProvider>
	)
}

export default Room

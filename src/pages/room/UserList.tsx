import { Box, Flex, Text } from '@chakra-ui/react'
import { FC, useEffect } from 'react'
import {
	USER_JOIN_ROOM,
	USER_LEAVE_ROOM,
} from 'src/common/constants/lobby.event'
import { User, UserWithSocketId } from 'src/common/core/lobby/lobby.interface'
import { useRoomContext } from 'src/contexts/RoomContext'
import { socket } from 'src/contexts/SocketContext'

const UserList: FC = () => {
	const { users, addUser, deleteUser } = useRoomContext()
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

	return (
		<Flex
			borderRadius={'2xl'}
			bgColor={'pink.lightest'}
			p={6}
			direction="column"
		>
			<Text fontSize={'2xl'} fontWeight={600} mb={2}>
				Listeners
			</Text>
			<Box overflowY={'auto'} h="200px">
				{Object.keys(users).map((id) => {
					const user = users[id]
					const { name } = user
					return (
						<Text isTruncated key={id}>
							{name}
						</Text>
					)
				})}
			</Box>
		</Flex>
	)
}

export default UserList

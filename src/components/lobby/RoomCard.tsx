import { Box, Flex, Icon, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { BiHeadphone } from 'react-icons/bi'
import { Link } from 'react-router-dom'
import {
	LobbyRoomResponse,
	RoomResponse,
} from 'src/common/core/lobby/lobby.interface'
interface Props {
	room: LobbyRoomResponse
}
const RoomCard: FC<Props> = ({ room }) => {
	const { id: roomId, name, userCount, nowPlaying } = room
	const { title } = nowPlaying || {}
	return (
		<Link to={`/${roomId}`}>
			<Box
				bgColor={'white'}
				_hover={{ bgColor: 'green.lightest' }}
				cursor={'pointer'}
				shadow={'md'}
				height="100px"
				p={4}
			>
				<Text isTruncated fontSize={'lg'} fontWeight={600}>
					{name}
				</Text>
				<Text isTruncated fontSize={'sm'}>
					Now playing: {title}
				</Text>
				<Flex overflowX="hidden" align="center">
					<Icon boxSize={'16px'} as={BiHeadphone} mr={1} />
					<Text fontWeight={600} fontSize={'md'}>
						{userCount}
					</Text>
				</Flex>
			</Box>
		</Link>
	)
}

export default RoomCard

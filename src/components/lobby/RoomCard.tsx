import { Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { Link } from 'react-router-dom'

interface Props {
	roomId: string
	name: string
}
const RoomCard: FC<Props> = ({ roomId, name }) => {
	return (
		<Link to={`/${roomId}`}>
			<Flex
				_hover={{ bgColor: 'purple.lightest' }}
				cursor={'pointer'}
				shadow={'md'}
				height="150px"
				p={4}
			>
				<Text fontSize={'lg'} fontWeight={600}>
					{name}
				</Text>
			</Flex>
		</Link>
	)
}

export default RoomCard

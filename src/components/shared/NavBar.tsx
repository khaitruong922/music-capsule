import { Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { Link } from 'react-router-dom'

const NavBar: FC = () => {
	return (
		<Flex py={4} px={8} align="center" bgColor="#111111" h="64px">
			<Link to="/">
				<Text color="green.main" fontSize="lg" fontWeight={600}>
					Music Capsule
				</Text>
			</Link>
		</Flex>
	)
}
export default NavBar

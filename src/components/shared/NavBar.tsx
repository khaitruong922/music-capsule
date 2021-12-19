import { Box, Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'

const NavBar: FC = () => {
	return (
		<Flex p={4} align="center" bgColor="#111111" h="64px">
			<Text color="green.main" fontSize="lg" fontWeight={600}>
				Music Capsule
			</Text>
		</Flex>
	)
}
export default NavBar

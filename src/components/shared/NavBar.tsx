import { Flex, Image, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { Link } from 'react-router-dom'
import images from 'src/assets/images'

const NavBar: FC = () => {
	return (
		<Flex py={4} px={8} align="center" bgColor="gray.900" h="64px">
			<Link to="/">
				<Image userSelect={'none'} h="40px" src={images.logo} />
			</Link>
			<Link to="/">
				<Text
					userSelect={'none'}
					color="green.main"
					fontSize="lg"
					fontWeight={600}
				>
					Music Capsule
				</Text>
			</Link>
		</Flex>
	)
}
export default NavBar

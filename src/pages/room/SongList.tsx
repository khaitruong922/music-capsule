import { Box, Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { formatTimeMMSS } from 'src/common/utils/time'
import { useRoomContext } from 'src/contexts/RoomContext'

const SongList: FC = () => {
	const { queue } = useRoomContext()
	return (
		<Flex direction="column">
			<Box mt={3} h="500px" overflowY={'auto'}>
				{queue?.map((song, index) => {
					const { fileName, title, author, length } = song
					return (
						<Flex
							py={2}
							px={4}
							bgColor={index === 0 ? 'gray.700' : 'gray.800'}
							align="center"
							key={fileName}
						>
							<Text mr={4} color="white" fontSize={'lg'} fontWeight={600}>
								{index + 1}
							</Text>
							<Flex direction="column">
								<Text color="green.main" fontWeight={600} isTruncated>
									{title}
								</Text>
								<Text color="purple.lighter" fontWeight={500} isTruncated>
									{author}
								</Text>
							</Flex>
							<Text color="white" ml="auto" isTruncated>
								{formatTimeMMSS(length)}
							</Text>
						</Flex>
					)
				})}
			</Box>
		</Flex>
	)
}
export default SongList

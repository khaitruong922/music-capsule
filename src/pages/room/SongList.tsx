import { Box, Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { formatTimeMMSS } from 'src/common/utils/time'
import { useRoomContext } from 'src/contexts/RoomContext'

const SongList: FC = () => {
	const { queue } = useRoomContext()
	return (
		<Flex
			borderRadius={'2xl'}
			bgColor={'green.lightest'}
			p={6}
			direction="column"
		>
			<Text mb={2} fontSize={'2xl'} fontWeight={600}>
				Queue
			</Text>
			<Box mt={3} h="390px" overflowY={'auto'}>
				{queue.map((song, index) => {
					const { fileName, title, author, length } = song
					return (
						<Flex
							py={2}
							px={4}
							bgColor={index === 0 ? 'green.light' : 'white'}
							align="center"
							key={fileName}
							boxShadow="md"
						>
							<Text mr={4} fontSize={'lg'}>
								{index + 1}
							</Text>
							<Flex direction="column">
								<Text fontWeight={600} isTruncated>
									{title}
								</Text>
								<Text fontWeight={500} isTruncated>
									{author}
								</Text>
							</Flex>
							<Text ml="auto" isTruncated>
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

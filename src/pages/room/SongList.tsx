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
			<Text fontSize={'2xl'} fontWeight={600}>
				Queue
			</Text>
			<Box p={2} h="400px" maxH="400px" overflowY={'auto'}>
				{queue.map((song, index) => {
					const { fileName, title, author, length } = song
					return (
						<Flex align="center" key={fileName}>
							<Text fontWeight={index === 0 ? 600 : 500} noOfLines={1} w="80%">
								{index + 1}. {author} - {title}
							</Text>
							<Text ml="auto" noOfLines={1}>
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

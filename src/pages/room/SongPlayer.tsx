import {
	Box,
	Button,
	Flex,
	Icon,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Text,
} from '@chakra-ui/react'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { BsFillVolumeMuteFill, BsFillVolumeUpFill } from 'react-icons/bs'
import { NEXT_SONG, SKIP, SONG_ADDED } from 'src/common/constants/stream.event'
import StaticService from 'src/common/core/static/static.service'
import { Song } from 'src/common/core/stream/stream.interface'
import { formatTimeMMSS } from 'src/common/utils/time'
import { useRoomContext } from 'src/contexts/RoomContext'
import { useSocket } from 'src/contexts/SocketContext'

const MuteButton: FC = () => {
	const { muted, toggleMuted } = useRoomContext()
	return (
		<Icon
			onClick={toggleMuted}
			aria-label="toggle-muted"
			as={muted ? BsFillVolumeMuteFill : BsFillVolumeUpFill}
			bgColor="transparent"
			cursor={'pointer'}
			p={2}
			color={'purple.main'}
			boxSize={'45px'}
			borderRadius={'full'}
			_hover={{ bgColor: 'pink.light' }}
		/>
	)
}

const SongPlayer: FC = () => {
	const socket = useSocket()
	const {
		queue,
		addSong,
		nextSong,
		playingRef,
		volume,
		setVolume,
		currentTime,
		setCurrentTime,
		setMuted,
		muted,
	} = useRoomContext()
	const audioRef = useRef<HTMLAudioElement>(null)
	const [autoplayBlocked, setAutoplayBlocked] = useState(false)

	const playCurrentSong = useCallback(async () => {
		const audio = audioRef.current
		if (!audio) return
		const song = queue[0]
		console.log(song)
		if (!song) {
			audio.src = ''
			playingRef.current = false
			return
		}
		const { fileName, startTime } = song
		const url = StaticService.getMp3Url(fileName)
		audio.src = url
		audio.load()
		try {
			audio.currentTime = startTime ? Date.now() / 1000 - startTime : 0
			await audio.play()
			playingRef.current = true
			setAutoplayBlocked(false)
			console.log('good')
		} catch (e) {
			setAutoplayBlocked(true)
			console.log('bad')
		}
	}, [queue.length])

	const onSliderChange = (value: number) => {
		setVolume(value / 100)
	}

	const requestSkip = () => {
		socket.emit(SKIP)
	}

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return
		audio.volume = volume
	}, [volume])

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return

		const onTimeUpdate = () => {
			setCurrentTime(Math.max(Math.floor(audio.currentTime), 0))
		}
		audio.addEventListener('timeupdate', onTimeUpdate)

		const songAdded = ({ song }: { song: Song }) => {
			addSong(song)
			const url = StaticService.getMp3Url(song.fileName)
			console.log('🚀 ~ file: RoomPage.tsx ~ line 88 ~ songAdded ~ url', url)
		}

		const onNextSong = () => {
			// Shift to next song
			console.log('nextSong')
			playingRef.current = false
			nextSong()
		}

		socket.on(SONG_ADDED, songAdded)
		socket.on(NEXT_SONG, onNextSong)
		return () => {
			socket.off(SONG_ADDED, songAdded)
			socket.off(NEXT_SONG, onNextSong)
		}
	}, [])

	useEffect(() => {
		if (!playingRef.current) {
			playCurrentSong()
		}
	}, [queue.length])

	const currentSong = queue[0]
	const { title = 'Title', author = 'Channel', length } = currentSong || {}

	return (
		<Flex
			bgColor={'purple.white'}
			direction="column"
			borderRadius={'2xl'}
			h="200px"
			p={6}
		>
			<audio ref={audioRef} muted={muted} autoPlay />
			{autoplayBlocked ? (
				<Button
					onClick={playCurrentSong}
					colorScheme={'purple'}
					width={'fit-content'}
					alignSelf={'center'}
					my="auto"
					size="lg"
				>
					Listen
				</Button>
			) : (
				<>
					<Box w="100%" mb={4}>
						<Text noOfLines={1} isTruncated fontWeight={'bold'} fontSize={'xl'}>
							{title}
						</Text>
						<Text noOfLines={1} isTruncated>
							{author}
						</Text>
					</Box>
					<Slider
						mb={2}
						value={currentTime}
						min={0}
						max={length}
						isReadOnly
						cursor={'default'}
					>
						<SliderTrack
							borderRadius={'2xl'}
							bgColor={'green.lightest'}
							height={'10px'}
						>
							<SliderFilledTrack bgColor={'green.main'} />
						</SliderTrack>
					</Slider>
					<Flex mb={2} fontWeight={'bold'} align="center">
						<Text mr="auto">{formatTimeMMSS(currentTime)}</Text>
						<Text ml="auto">{formatTimeMMSS(length)}</Text>
					</Flex>
				</>
			)}
			<Flex
				align="center"
				alignSelf="flex-end"
				w={['70%', '60%', '50%', '40%', '30%']}
			>
				<Slider
					value={volume * 100}
					min={0}
					max={100}
					onChange={onSliderChange}
					mr={2}
				>
					<SliderTrack borderRadius={'full'} bgColor={'purple.light'}>
						<SliderFilledTrack bgColor={'purple.main'} />
					</SliderTrack>
					<SliderThumb bgColor={'purple.main'} />
				</Slider>
				<MuteButton />
				<Button
					ml={2}
					disabled={autoplayBlocked}
					onClick={requestSkip}
					fontSize={['xs', 'xs', 'sm', 'md']}
					size={'sm'}
					px={6}
					colorScheme="purple"
				>
					Skip
				</Button>
			</Flex>
		</Flex>
	)
}

export default SongPlayer

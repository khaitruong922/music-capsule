import {
	Box,
	Button,
	Flex,
	Icon,
	IconButton,
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
	Text,
} from '@chakra-ui/react'
import { FC, useEffect, useRef } from 'react'
import { BsFillVolumeMuteFill, BsFillVolumeUpFill } from 'react-icons/bs'
import audio from 'src/assets/audio'
import { NEXT_SONG, SKIP, SONG_ADDED } from 'src/common/constants/stream.event'
import StaticService from 'src/common/core/static/static.service'
import { Song } from 'src/common/core/stream/stream.interface'
import { formatTimeMMSS } from 'src/common/utils/time'
import { useRoomContext } from 'src/contexts/RoomContext'
import { useSocket } from 'src/contexts/SocketContext'
import SongList from './SongList'

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
			color={'purple.dark'}
			boxSize={'40px'}
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

	const playCurrentSong = () => {
		const audio = audioRef.current
		if (!audio) return
		const song = queue[0]
		console.log(
			'🚀 ~ file: RoomPage.tsx ~ line 101 ~ playCurrentSong ~ song',
			song,
		)
		if (!song) {
			console.log('no song')
			audio.src = ''
			playingRef.current = false
			return
		}
		const { fileName, startTime } = song
		const url = StaticService.getMp3Url(fileName)
		audio.src = url
		audio.currentTime = startTime ? Date.now() / 1000 - startTime : 0
		audio.load()
		audio.play()
		playingRef.current = true
	}

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
			p={6}
		>
			<iframe
				src={audio.silence}
				allow="autoplay"
				style={{ display: 'none' }}
			></iframe>

			<audio ref={audioRef} muted={muted} autoPlay />
			<Box w="100%" mb={4} overflowX="hidden">
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
					mr={4}
				>
					<SliderTrack borderRadius={'full'} bgColor={'purple.light'}>
						<SliderFilledTrack bgColor={'purple.main'} />
					</SliderTrack>
					<SliderThumb bgColor={'purple.main'} />
				</Slider>
				<MuteButton />
				<Button
					onClick={requestSkip}
					fontSize={['xs', 'xs', 'sm', 'md']}
					size={'sm'}
					px={4}
					colorScheme="purple"
				>
					Skip
				</Button>
			</Flex>
		</Flex>
	)
}

export default SongPlayer

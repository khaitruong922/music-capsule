import { Button, chakra, Flex, Input, Text } from '@chakra-ui/react'
import { FC, FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { JOIN_ROOM, LEAVE_ROOM } from 'src/common/constants/lobby.event'
import {
	ADD_SONG,
	ADD_SONG_FAILED,
	ADD_SONG_SUCCESS,
	SONG_ADDED,
} from 'src/common/constants/stream.event'
import { RoomWithUsers } from 'src/common/core/lobby/lobby.interface'
import LobbyService from 'src/common/core/lobby/lobby.service'
import StaticService from 'src/common/core/static/static.service'
import { Song } from 'src/common/core/stream/stream.interface'
import useInput from 'src/common/hooks/useInput'
import { useErrorToast, useSuccessToast } from 'src/components/shared/toast'
import { useLobbyContext } from 'src/contexts/LobbyContext'
import { RoomProvider, useRoomContext } from 'src/contexts/RoomContext'
import { useSocket } from 'src/contexts/SocketContext'

const AddSongForm: FC = () => {
	const socket = useSocket()
	const [loading, setLoading] = useState(false)
	const errorToast = useErrorToast()
	const successToast = useSuccessToast()

	const { value: url, onInput: onUrlInput, reset: resetUrlInput } = useInput('')
	const addSong = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setLoading(true)
		socket.emit(ADD_SONG, { url })
	}

	useEffect(() => {
		const addSongSuccess = ({ song }: { song: Song }) => {
			setLoading(false)
			successToast({
				title: 'Add song successfully',
				description: `${song.title} has been added to queue`,
			})
			resetUrlInput()
		}
		const addSongFailed = ({ message }: { message: string }) => {
			setLoading(false)
			errorToast({
				title: 'Add song failed',
				description: message,
			})
		}
		socket.on(ADD_SONG_SUCCESS, addSongSuccess)
		socket.on(ADD_SONG_FAILED, addSongFailed)

		return () => {
			socket.off(ADD_SONG_SUCCESS, addSongSuccess)
			socket.off(ADD_SONG_FAILED, addSongFailed)
		}
	}, [])

	return (
		<chakra.form
			width="60%"
			minW="400px"
			onSubmit={addSong}
			display="flex"
			mt={4}
		>
			<Input
				value={url}
				onInput={onUrlInput}
				placeholder="YouTube URL"
				borderColor="green.light"
				focusBorderColor="green.main"
				mr={2}
				isRequired
			/>
			<Button
				_focus={{ boxShadow: 'none' }}
				colorScheme={'whatsapp'}
				type="submit"
				px={6}
				isLoading={loading}
			>
				Add to queue
			</Button>
		</chakra.form>
	)
}

const SongPlayer: FC = () => {
	const socket = useSocket()
	const { roomId } = useParams()
	const { queue, addSong, nextSong, fetchQueue } = useRoomContext()
	const audioRef = useRef<HTMLAudioElement>(null)

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return
		fetchQueue(roomId!)
		audio.addEventListener('ended', () => {
			nextSong()
		})
		const songAdded = ({ song }: { song: Song }) => {
			addSong(song)
			const url = StaticService.getMp3Url(song.fileName)
			console.log('🚀 ~ file: RoomPage.tsx ~ line 88 ~ songAdded ~ url', url)
		}
		socket.on(SONG_ADDED, songAdded)
		return () => {
			socket.off(SONG_ADDED, songAdded)
		}
	}, [])

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return
		if (queue.length === 0) {
			return
		}
		// Should play the song immediately when there is 1 song
		if (queue.length === 1) {
			const song = queue[0]
			const url = StaticService.getMp3Url(song.fileName)
			audio.src = url
			audio.muted = false
			audio.currentTime = song.startTime
				? Date.now() / 1000 - song.startTime
				: 0
			audio.load()
			audio.play()
		}
	}, [queue])

	return <audio ref={audioRef} muted autoPlay controls />
}

const RoomPage: FC = () => {
	const socket = useSocket()
	const { roomId } = useParams()
	const { joinedLobby } = useLobbyContext()
	const { id: socketId } = socket
	const navigate = useNavigate()
	const [loading, setLoading] = useState(true)
	const [room, setRoom] = useState<RoomWithUsers>()

	const fetchRoom = useCallback(async () => {
		setLoading(true)
		try {
			const room = await LobbyService.getRoom(roomId!)
			setRoom(room)
		} catch (e) {
			navigate('/', { replace: true })
		} finally {
			setLoading(false)
		}
	}, [roomId])

	useEffect(() => {
		fetchRoom()
	}, [])

	useEffect(() => {
		if (loading) return
		if (!joinedLobby) return
		socket.emit(JOIN_ROOM, { socketId, roomId })
		return () => {
			socket.emit(LEAVE_ROOM, { socketId, roomId })
		}
	}, [loading, joinedLobby])

	if (!loading && !room) return <Navigate to="/" replace={true} />
	return (
		<RoomProvider>
			<Flex p={8} justify="center" direction="column">
				<Text fontSize="2xl" fontWeight={600}>
					Room {room?.name}
				</Text>
				<Flex align="center" justify="center">
					<AddSongForm />
				</Flex>
				<SongPlayer />
			</Flex>
		</RoomProvider>
	)
}

export default RoomPage

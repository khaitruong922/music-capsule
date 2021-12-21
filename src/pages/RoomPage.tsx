import { Button, chakra, Flex, Input, Text } from '@chakra-ui/react'
import { FC, FormEvent, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
	JOIN_ROOM,
	LEAVE_ROOM,
	USER_JOIN_ROOM,
	USER_LEAVE_ROOM,
} from 'src/common/constants/lobby.event'
import {
	ADD_SONG,
	ADD_SONG_FAILED,
	ADD_SONG_SUCCESS,
	NEXT_SONG,
	SKIP,
	SONG_ADDED,
} from 'src/common/constants/stream.event'
import { User, UserWithSocketId } from 'src/common/core/lobby/lobby.interface'
import StaticService from 'src/common/core/static/static.service'
import { Song } from 'src/common/core/stream/stream.interface'
import useInput from 'src/common/hooks/useInput'
import { useErrorToast, useSuccessToast } from 'src/components/shared/toast'
import { useLobbyContext } from 'src/contexts/LobbyContext'
import { useRoomContext } from 'src/contexts/RoomContext'
import { socket, useSocket } from 'src/contexts/SocketContext'

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
	const { queue, addSong, nextSong, playingRef } = useRoomContext()
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
		audio.muted = false
		audio.currentTime = startTime ? Date.now() / 1000 - startTime : 0
		audio.load()
		audio.play()
		playingRef.current = true
	}

	const requestSkip = () => {
		socket.emit(SKIP)
	}

	useEffect(() => {
		const audio = audioRef.current
		if (!audio) return
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

	return (
		<Flex direction="column">
			<Flex align="center">
				<audio ref={audioRef} muted autoPlay controls />
				<Button onClick={requestSkip} colorScheme="purple">
					Skip
				</Button>
			</Flex>
			<SongList />
		</Flex>
	)
}

const UserList: FC = () => {
	const { users, addUser, deleteUser } = useRoomContext()
	useEffect(() => {
		const userJoinRoom = ({ user }: { user: UserWithSocketId }) => {
			console.log('userJoinRoom', user)
			addUser(user)
		}
		const userLeaveRoom = ({ socketId }: { socketId: string }) => {
			deleteUser(socketId)
		}
		socket.on(USER_JOIN_ROOM, userJoinRoom)
		socket.on(USER_LEAVE_ROOM, userLeaveRoom)
		return () => {
			socket.off(USER_JOIN_ROOM, userJoinRoom)
			socket.off(USER_LEAVE_ROOM, userLeaveRoom)
		}
	}, [])

	return (
		<Flex direction="column">
			<Text>Users</Text>
			{Object.keys(users).map((id) => {
				const user = users[id]
				const { name } = user
				return <Flex key={id}>{name}</Flex>
			})}
		</Flex>
	)
}

const SongList: FC = () => {
	const { queue } = useRoomContext()
	return (
		<Flex direction="column">
			<Text>Songs</Text>
			{queue.map((song) => {
				const { fileName, title, author, startTime, length } = song
				return <Flex key={fileName}>{title}</Flex>
			})}
		</Flex>
	)
}

const RoomPage: FC = () => {
	const socket = useSocket()
	const { roomId } = useParams()
	const { joinedLobby } = useLobbyContext()
	const { fetchRoom, loading, room, leaveRoom } = useRoomContext()
	const { id: socketId } = socket
	const navigate = useNavigate()

	useEffect(() => {
		return () => {
			leaveRoom()
		}
	}, [])

	useEffect(() => {
		fetchRoom(roomId!)
	}, [roomId])

	useEffect(() => {
		if (loading) return
		if (!joinedLobby) return
		if (!room) {
			navigate('/', { replace: true })
			return
		}
		socket.emit(JOIN_ROOM, { socketId, roomId })
		return () => {
			socket.emit(LEAVE_ROOM, { socketId, roomId })
		}
	}, [loading, joinedLobby])

	if (!room) return <></>
	return (
		<Flex p={8} justify="center" direction="column">
			<Text fontSize="2xl" fontWeight={600}>
				Room {room?.name}
			</Text>
			<Flex align="center" justify="center">
				<AddSongForm />
			</Flex>
			<SongPlayer />
			<UserList />
		</Flex>
	)
}

export default RoomPage

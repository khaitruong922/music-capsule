import { createContext, FC, useContext, useState } from 'react'
import { Song } from 'src/common/core/stream/stream.interface'
import StreamService from 'src/common/core/stream/stream.service'

interface RoomContextProps {
	queue: Song[]
	addSong: (song: Song) => any
	nextSong: () => any
	fetchQueue: (roomId: string) => any
}
export const RoomContext = createContext<RoomContextProps | undefined>(
	undefined,
)
export const RoomProvider: FC = ({ children }) => {
	const [queue, setQueue] = useState<Song[]>([])
	const fetchQueue = async (roomId: string) => {
		const queue = await StreamService.fetchQueue(roomId)
		console.log(
			'🚀 ~ file: RoomContext.tsx ~ line 18 ~ fetchQueue ~ queue',
			queue,
		)
		setQueue(queue)
	}
	const addSong = (song: Song) => {
		setQueue((queue) => [...queue, song])
	}
	const nextSong = () => {
		setQueue((queue) => {
			const newQueue = [...queue]
			newQueue.shift()
			return newQueue
		})
	}
	const value = { queue, addSong, nextSong, fetchQueue }
	return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>
}

export const useRoomContext = () => {
	const context = useContext(RoomContext)
	if (context === undefined)
		throw new Error('useRoomContext must be within RoomProvider')
	return context
}

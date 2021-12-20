import api from 'src/common/api'
import { Song, SongQueues } from './stream.interface'

const QUEUE_ROUTE = '/stream/queues'

const fetchQueues = async (): Promise<SongQueues> => {
	const res = await api.get(QUEUE_ROUTE)
	return res.data
}
const fetchQueue = async (roomId: string): Promise<Song[]> => {
	const res = await api.get(`${QUEUE_ROUTE}/${roomId}`)
	return res.data
}

const StreamService = {
	fetchQueues,
	fetchQueue,
}
export default StreamService

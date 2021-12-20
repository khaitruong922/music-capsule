import api from 'src/common/api'
import { Rooms, RoomWithUsers } from './lobby.interface'

const ROOMS_ROUTE = '/lobby/rooms'

const getRooms = async (): Promise<Rooms> => {
	const res = await api.get(ROOMS_ROUTE)
	return res.data
}

const getRoom = async (id: string): Promise<RoomWithUsers> => {
	const res = await api.get(`${ROOMS_ROUTE}/${id}`)
	return res.data
}

const LobbyService = {
	getRooms,
	getRoom,
}

export default LobbyService

import api from 'src/common/api'
import { RoomWithUsers } from './lobby.interface'

const ROOMS_ROUTE = '/lobby/rooms'

const getRooms = async (): Promise<RoomWithUsers[]> => {
	return api.get(ROOMS_ROUTE)
}

const getRoom = async (id: string): Promise<RoomWithUsers> => {
	return api.get(`${ROOMS_ROUTE}/${id}`)
}

const LobbyService = {
	getRooms,
	getRoom,
}

export default LobbyService

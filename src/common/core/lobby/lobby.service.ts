import api from 'src/common/api'
import { LobbyResponse, RoomResponse } from './lobby.interface'

const LOBBY_ROUTE = '/lobby'
const ROOMS_ROUTE = '/lobby/rooms'

const getLobby = async (): Promise<LobbyResponse> => {
	const res = await api.get(LOBBY_ROUTE)
	return res.data
}

const getRoom = async (id: string): Promise<RoomResponse> => {
	const res = await api.get(`${ROOMS_ROUTE}/${id}`)
	return res.data
}

const LobbyService = {
	getLobby,
	getRoom,
}

export default LobbyService

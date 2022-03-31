import { Song } from "../stream/stream.interface"

export interface WithSocketId {
    socketId: string
}

export interface User {
    name: string
}

export interface UserWithSocketId extends User, WithSocketId {}

export interface UserWithRoom extends UserWithSocketId {
    roomId: string
}

export interface Room {
    id: string
    name: string
}
export interface RoomResponse extends Room {
    users: Users
    queue: Song[]
}

export interface LobbyResponse {
    rooms: LobbyRoomsResponse
}

export interface LobbyRoomsResponse {
    [roomId: string]: LobbyRoomResponse
}

export interface LobbyRoomResponse extends Room {
    userCount: number
    nowPlaying: Song
}

export interface Users {
    [socketId: string]: User
}

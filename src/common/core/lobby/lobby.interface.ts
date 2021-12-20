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

export interface Rooms {
	[roomId: string]: RoomWithUsers
}

export interface RoomWithUsers extends Room {
	users: {
		[socketId: string]: UserWithSocketId
	}
}

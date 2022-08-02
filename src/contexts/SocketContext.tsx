import { createContext, FC, useContext } from "react"
import { io, Socket } from "socket.io-client"

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "ws://localhost:3001"
export const socket = io(SOCKET_URL)
export const SocketContext = createContext<Socket>(socket)
export const SocketProvider: FC = ({ children }) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => {
    const socket = useContext(SocketContext)
    return socket
}

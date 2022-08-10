import { Box } from "@chakra-ui/react"
import { FC, useEffect } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Lobby from "src/pages/Lobby"
import { JOIN_LOBBY, LOBBY_JOINED } from "./common/constants/lobby.event"
import NavBar from "./components/shared/NavBar"
import { useLobbyContext } from "./contexts/LobbyContext"
import { useSocket } from "./contexts/SocketContext"
import { useUserContext } from "./contexts/UserContext"
import Landing from "./pages/Landing"
import RoomPage from "./pages/room/RoomPage"

const AppRouter: FC = () => {
    const { name } = useUserContext()
    const { setJoinedLobby } = useLobbyContext()
    const socket = useSocket()

    useEffect(() => {
        if (!name) return
        socket.emit(JOIN_LOBBY, { user: { name } })
    }, [name])

    useEffect(() => {
        const lobbyJoined = async () => {
            setJoinedLobby(true)
        }
        socket.on(LOBBY_JOINED, lobbyJoined)
        return () => {
            socket.disconnect()
            socket.off(LOBBY_JOINED, lobbyJoined)
        }
    }, [])

    return (
        <BrowserRouter>
            <Box h="calc(100% - 64px)">
                <NavBar />
                {name ? (
                    <Routes>
                        <Route path="/">
                            <Route index element={<Lobby />}></Route>
                            <Route
                                path="/:roomId"
                                element={<RoomPage />}
                            ></Route>
                        </Route>
                    </Routes>
                ) : (
                    <Landing />
                )}
            </Box>
        </BrowserRouter>
    )
}
export default AppRouter

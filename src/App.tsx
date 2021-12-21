import { ChakraProvider } from '@chakra-ui/react'
import { FC } from 'react'
import AppRouter from './AppRouter'
import appTheme from './appTheme'
import { LobbyProvider } from './contexts/LobbyContext'
import { RoomProvider } from './contexts/RoomContext'
import { SocketProvider } from './contexts/SocketContext'
import { UserProvider } from './contexts/UserContext'

const App: FC = () => {
	return (
		<ChakraProvider theme={appTheme}>
			<SocketProvider>
				<LobbyProvider>
					<RoomProvider>
						<UserProvider>
							<AppRouter />
						</UserProvider>
					</RoomProvider>
				</LobbyProvider>
			</SocketProvider>
		</ChakraProvider>
	)
}

export default App

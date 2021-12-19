import { ChakraProvider } from '@chakra-ui/react'
import { FC } from 'react'
import AppRouter from './AppRouter'
import appTheme from './appTheme'
import { LobbyProvider } from './contexts/LobbyContext'
import { SocketProvider } from './contexts/SocketContext'
import { UserProvider } from './contexts/UserContext'

const App: FC = () => {
	return (
		<ChakraProvider theme={appTheme}>
			<SocketProvider>
				<LobbyProvider>
					<UserProvider>
						<AppRouter />
					</UserProvider>
				</LobbyProvider>
			</SocketProvider>
		</ChakraProvider>
	)
}

export default App

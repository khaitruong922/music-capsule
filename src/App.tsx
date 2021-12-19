import { ChakraProvider } from '@chakra-ui/react'
import { FC } from 'react'
import AppRouter from './AppRouter'
import appTheme from './appTheme'
import { UserProvider } from './contexts/UserContext'

const App: FC = () => {
	return (
		<ChakraProvider theme={appTheme}>
			<UserProvider>
				<AppRouter />
			</UserProvider>
		</ChakraProvider>
	)
}

export default App

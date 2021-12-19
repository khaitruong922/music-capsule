import { ChakraProvider, theme } from '@chakra-ui/react'
import { FC } from 'react'
import AppRouter from './AppRouter'

const App: FC = () => {
	return (
		<ChakraProvider theme={theme}>
			<AppRouter />
		</ChakraProvider>
	)
}

export default App

import { Flex } from '@chakra-ui/react'
import { FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Lobby from 'src/pages/Lobby'
import NavBar from './components/shared/NavBar'
import { useUserContext } from './contexts/UserContext'
import Landing from './pages/Landing'
import Room from './pages/Room'

const AppRouter: FC = () => {
	const { name } = useUserContext()
	return (
		<BrowserRouter>
			<Flex direction="column" minH="100vh">
				<NavBar />
				<Routes>
					<Route path="/">
						<Route index element={name ? <Lobby /> : <Landing />}></Route>
						<Route path="/:roomId" element={<Room />}></Route>
					</Route>
				</Routes>
			</Flex>
		</BrowserRouter>
	)
}
export default AppRouter

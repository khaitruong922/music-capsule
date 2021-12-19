import { FC } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from 'src/Home'

const AppRouter: FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/">
					<Route index element={<Home />}></Route>
				</Route>
			</Routes>
		</BrowserRouter>
	)
}
export default AppRouter

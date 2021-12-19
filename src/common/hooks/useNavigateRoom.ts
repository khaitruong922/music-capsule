import { useNavigate } from 'react-router-dom'

const useNavigateRoom = () => {
	const navigate = useNavigate()
	return (roomId: string) => navigate(`/${roomId}`)
}

export default useNavigateRoom

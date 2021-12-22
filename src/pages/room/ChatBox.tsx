import { Box, Button, chakra, Flex, Input, Text } from '@chakra-ui/react'
import { FC, FormEvent, useEffect, useState } from 'react'
import { CHAT, USER_CHAT } from 'src/common/constants/chat.event'
import {
	USER_JOIN_ROOM,
	USER_LEAVE_ROOM,
} from 'src/common/constants/lobby.event'
import { User, UserWithSocketId } from 'src/common/core/lobby/lobby.interface'
import useInput from 'src/common/hooks/useInput'
import { CHAT_MAX_LENGTH, filterChat } from 'src/common/utils/string'
import { socket } from 'src/contexts/SocketContext'

type ChatPayload = {
	user: UserWithSocketId
	content: string
}

const ChatBox: FC = () => {
	const {
		value: chatInput,
		onInput: onChatInput,
		reset: resetChatInput,
	} = useInput('')
	const [messages, setMessages] = useState<string[]>([])

	const addMessage = (message: string) => {
		setMessages((messages) => [...messages, message])
	}

	const onChatSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const content = filterChat(chatInput)
		socket.emit(CHAT, { content })
		resetChatInput()
	}

	useEffect(() => {
		const userJoinRoom = ({ user }: { user: User }) => {
			addMessage(`${user.name} has joined the room`)
		}
		const userLeaveRoom = ({ user }: { user: User }) => {
			addMessage(`${user.name} has left the room`)
		}
		const userChat = ({ user, content }: ChatPayload) => {
			addMessage(`${user.name}: ${content}`)
		}
		socket.on(USER_JOIN_ROOM, userJoinRoom)
		socket.on(USER_LEAVE_ROOM, userLeaveRoom)
		socket.on(USER_CHAT, userChat)
		return () => {
			socket.off(USER_JOIN_ROOM, userJoinRoom)
			socket.off(USER_LEAVE_ROOM, userLeaveRoom)
			socket.off(USER_CHAT, userChat)
		}
	}, [])

	return (
		<Flex
			borderRadius={'2xl'}
			bgColor={'orange.lightest'}
			p={6}
			direction="column"
		>
			<Text fontSize={'2xl'} fontWeight={600}>
				Chat
			</Text>
			<Box overflowY={'scroll'} h="270px" maxH="270px">
				{messages.map((message, index) => {
					return <Flex key={index}>{message}</Flex>
				})}
			</Box>
			<chakra.form mt={2} display="flex" onSubmit={onChatSubmit}>
				<Input
					value={chatInput}
					onInput={onChatInput}
					placeholder="Your message here"
					borderColor="orange.light"
					focusBorderColor="orange.main"
					mr={2}
					size={'sm'}
					isRequired
					maxLength={CHAT_MAX_LENGTH}
				/>
				<Button
					_focus={{ boxShadow: 'none' }}
					colorScheme={'orange'}
					type="submit"
					px={6}
					width={'fit-content'}
					size={'sm'}
					borderRadius={'md'}
					fontSize={['sm', 'sm', 'sm', 'md']}
				>
					Send
				</Button>
			</chakra.form>
		</Flex>
	)
}

export default ChatBox

import { Box, Button, chakra, Flex, Input, Text } from "@chakra-ui/react"
import { FC, FormEvent, useEffect, useRef, useState } from "react"
import { CHAT, USER_CHAT } from "src/common/constants/chat.event"
import {
    USER_JOIN_ROOM,
    USER_LEAVE_ROOM,
} from "src/common/constants/lobby.event"
import { SONG_ADDED } from "src/common/constants/stream.event"
import { User, UserWithSocketId } from "src/common/core/lobby/lobby.interface"
import { Song } from "src/common/core/stream/stream.interface"
import useInput from "src/common/hooks/useInput"
import { CHAT_MAX_LENGTH, filterChat } from "src/common/utils/string"
import { socket } from "src/contexts/SocketContext"

type ChatPayload = {
    user: UserWithSocketId
    content: string
}

type Message = {
    username: string
    content: string
    isSystem?: boolean
}

const ChatBox: FC = () => {
    const {
        value: chatInput,
        onInput: onChatInput,
        reset: resetChatInput,
    } = useInput("")
    const [messages, setMessages] = useState<Message[]>([])
    const chatBoxRef = useRef<HTMLDivElement | null>(null)
    const height = 400

    const addMessage = (message: Message) => {
        if (!chatBoxRef.current) return
        const shouldScrollDown =
            chatBoxRef.current.scrollTop + height ===
            chatBoxRef.current.scrollHeight
        setMessages((messages) => [...messages, message])
        if (shouldScrollDown)
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }

    const onChatSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!chatInput) return
        const content = filterChat(chatInput)
        socket.emit(CHAT, { content })
        resetChatInput()
    }

    useEffect(() => {
        const userJoinRoom = ({ user }: { user: User }) => {
            addMessage({
                username: "",
                content: `${user.name} has joined the room`,
                isSystem: true,
            })
        }
        const userLeaveRoom = ({ user }: { user: User }) => {
            // console.log('leave room')
            if (!user) return
            addMessage({
                username: "",
                content: `${user.name} has left the room`,
                isSystem: true,
            })
        }
        const userChat = ({ user, content }: ChatPayload) => {
            addMessage({
                username: user?.name,
                content,
            })
        }

        const songAdded = ({
            song,
            username,
        }: {
            song: Song
            username: string
        }) => {
            addMessage({
                username: "",
                content: `${username} has added ${song.title} to the queue`,
                isSystem: true,
            })
        }

        socket.on(USER_JOIN_ROOM, userJoinRoom)
        socket.on(USER_LEAVE_ROOM, userLeaveRoom)
        socket.on(USER_CHAT, userChat)
        socket.on(SONG_ADDED, songAdded)
        return () => {
            socket.off(USER_JOIN_ROOM, userJoinRoom)
            socket.off(USER_LEAVE_ROOM, userLeaveRoom)
            socket.off(USER_CHAT, userChat)
            socket.off(SONG_ADDED, songAdded)
        }
    }, [])

    return (
        <Flex direction="column" height="100%" flex={1}>
            <Box
                color="white"
                ref={chatBoxRef}
                overflowY={"auto"}
                h={height}
                mb={4}
            >
                {messages.map((message, index) => {
                    return (
                        <Flex key={index}>
                            <Text>
                                <chakra.span
                                    color={"green.main"}
                                    fontWeight={600}
                                >
                                    {message.username}
                                </chakra.span>
                                <chakra.span
                                    fontWeight={message.isSystem ? 600 : 500}
                                    color={
                                        message.isSystem
                                            ? "purple.lighter"
                                            : "inherit"
                                    }
                                >
                                    {message.username ? " " : ""}
                                    {message.content}
                                </chakra.span>
                            </Text>
                        </Flex>
                    )
                })}
            </Box>
            <chakra.form mt={"auto"} display="flex" onSubmit={onChatSubmit}>
                <Input
                    value={chatInput}
                    onInput={onChatInput}
                    placeholder="Send a message"
                    borderColor="green.light"
                    focusBorderColor="green.main"
                    color="white"
                    mr={2}
                    size={"sm"}
                    maxLength={CHAT_MAX_LENGTH}
                />
                <Button
                    _focus={{ boxShadow: "none" }}
                    colorScheme={"whatsapp"}
                    type="submit"
                    px={6}
                    width={"fit-content"}
                    size={"sm"}
                    borderRadius={"md"}
                    fontSize={["sm", "sm", "sm", "md"]}
                >
                    Chat
                </Button>
            </chakra.form>
        </Flex>
    )
}

export default ChatBox

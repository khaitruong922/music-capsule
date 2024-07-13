import { Box, Button, chakra, Flex, Input, Text } from "@chakra-ui/react"
import { FC, FormEvent, useEffect, useRef, useState } from "react"
import {
    CHAT,
    FAST_FORWARD,
    INVALID_COMMAND,
    USER_CHAT,
} from "src/common/constants/chat.event"
import {
    USER_JOIN_ROOM,
    USER_LEAVE_ROOM,
} from "src/common/constants/lobby.event"
import {
    QUEUE_CHANGED,
    SKIP,
    SONG_ADDED,
} from "src/common/constants/stream.event"
import { User, UserWithSocketId } from "src/common/core/lobby/lobby.interface"
import { Song } from "src/common/core/stream/stream.interface"
import useInput from "src/common/hooks/useInput"
import { CHAT_MAX_LENGTH, filterChat } from "src/common/utils/string"
import { socket } from "src/contexts/SocketContext"

type ChatPayload = {
    user: UserWithSocketId
    content: string
}

type MessageType = "chat" | "event" | "error" | "help" | "help-item"

type Message = {
    username?: string
    content: string
    type: MessageType
}

const HELP_COMMAND = "/help"

const messageTypeToColor = (type: MessageType) => {
    if (type === "event") return "purple.lighter"
    if (type === "error") return "red.400"
    if (type === "help") return "green.main"
    if (type === "help-item") return "green.light"
    if (type) return "inherit"
}

const messageTypeToFontWeight = (type: MessageType) => {
    if (type === "chat") return 600
    if (type === "help") return 600
    return 500
}

const HELP_MESSAGES: Message[] = [
    {
        type: "help",
        content: "Commands",
    },
    {
        type: "help-item",
        content: "1. /skip {x} Skip the song at x position (default: 1)",
    },
    {
        type: "help-item",
        content: "2. /ff {x} Fast-forward the song by x seconds (default: 5)",
    },
]

const ChatBox: FC = () => {
    const {
        value: chatInput,
        onInput: onChatInput,
        reset: resetChatInput,
    } = useInput("")
    const [messages, setMessages] = useState<Message[]>([
        {
            type: "help",
            content: "Type /help to see the list of commands",
        },
    ])
    const chatBoxRef = useRef<HTMLDivElement | null>(null)
    const height = 400

    const shouldScrolldownRef = useRef(true)
    const addMessages = (...messages: Message[]) => {
        if (!chatBoxRef.current) return
        shouldScrolldownRef.current =
            chatBoxRef.current.scrollTop + height ===
            chatBoxRef.current.scrollHeight
        setMessages((currentMessages) => [...currentMessages, ...messages])
    }
    useEffect(() => {
        if (!chatBoxRef.current) return
        if (shouldScrolldownRef.current)
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight
    }, [messages])

    const onChatSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!chatInput) return
        const content = filterChat(chatInput)
        if (content.toLowerCase() === HELP_COMMAND) {
            addMessages(...HELP_MESSAGES)
        } else {
            socket.emit(CHAT, { content })
        }
        resetChatInput()
    }

    useEffect(() => {
        const userJoinRoom = ({ user }: { user: User }) => {
            addMessages({
                content: `${user.name} has joined the room`,
                type: "event",
            })
        }
        const userLeaveRoom = ({ user }: { user: User }) => {
            if (!user) return
            addMessages({
                content: `${user.name} has left the room`,
                type: "event",
            })
        }
        const userChat = ({ user, content }: ChatPayload) => {
            addMessages({
                username: user?.name,
                content,
                type: "chat",
            })
        }

        const songAdded = ({
            song,
            username,
        }: {
            song: Song
            username: string
        }) => {
            addMessages({
                content: `${username} has added ${song.title} to the queue`,
                type: "event",
            })
        }

        const skip = ({
            username,
            title,
        }: {
            username: string
            title: string
        }) => {
            addMessages({
                content: `${username} has skipped ${title}.`,
                type: "event",
            })
        }

        const fastForward = ({
            username,
            seconds,
        }: {
            username: string
            seconds: number
        }) => {
            addMessages({
                content: `${username} has fast-forwarded this song by ${seconds} seconds.`,
                type: "event",
            })
        }

        const invalidCommand = ({ message }: { message: string }) => {
            addMessages({
                content: message,
                type: "error",
            })
        }

        const queueChanged = ({
            username,
            title,
        }: {
            username: string
            title: string
        }) => {
            addMessages({
                content: `${username} has removed ${title} from the queue`,
                type: "event",
            })
        }

        socket.on(USER_JOIN_ROOM, userJoinRoom)
        socket.on(USER_LEAVE_ROOM, userLeaveRoom)
        socket.on(USER_CHAT, userChat)
        socket.on(SONG_ADDED, songAdded)
        socket.on(SKIP, skip)
        socket.on(FAST_FORWARD, fastForward)
        socket.on(INVALID_COMMAND, invalidCommand)
        socket.on(QUEUE_CHANGED, queueChanged)
        return () => {
            socket.off(USER_JOIN_ROOM, userJoinRoom)
            socket.off(USER_LEAVE_ROOM, userLeaveRoom)
            socket.off(USER_CHAT, userChat)
            socket.off(SONG_ADDED, songAdded)
            socket.off(SKIP, skip)
            socket.off(FAST_FORWARD, fastForward)
            socket.off(INVALID_COMMAND, invalidCommand)
            socket.off(QUEUE_CHANGED, queueChanged)
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
                                    fontWeight={messageTypeToFontWeight(
                                        message.type,
                                    )}
                                    color={messageTypeToColor(message.type)}
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

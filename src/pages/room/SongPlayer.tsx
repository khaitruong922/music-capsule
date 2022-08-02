import {
    Box,
    Button,
    Flex,
    Icon,
    Image,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Text,
} from "@chakra-ui/react"
import { FC, useCallback, useEffect, useRef, useState } from "react"
import { BsFillVolumeMuteFill, BsFillVolumeUpFill } from "react-icons/bs"
import { FaDownload, FaLink } from "react-icons/fa"
import {
    FAST_FORWARD,
    NEXT_SONG,
    SKIP,
    SONG_ADDED,
} from "src/common/constants/stream.event"
import DownloadService from "src/common/core/download/download.service"
import StaticService from "src/common/core/static/static.service"
import { Song } from "src/common/core/stream/stream.interface"
import { formatTimeMMSS } from "src/common/utils/time"
import { useSuccessToast } from "src/components/shared/toast"
import { useRoomContext } from "src/contexts/RoomContext"
import { useSocket } from "src/contexts/SocketContext"

const MuteButton: FC = () => {
    const { muted, toggleMuted } = useRoomContext()
    return (
        <Icon
            onClick={toggleMuted}
            aria-label="toggle-muted"
            as={muted ? BsFillVolumeMuteFill : BsFillVolumeUpFill}
            bgColor="transparent"
            cursor={"pointer"}
            p={2}
            color={"purple.main"}
            boxSize={"45px"}
            borderRadius={"full"}
        />
    )
}

const SkipButton: FC = () => {
    const { queue } = useRoomContext()
    const socket = useSocket()
    const song = queue[0]

    const requestSkip = useCallback(() => {
        socket.emit(SKIP)
    }, [socket])
    return (
        <Button
            disabled={!song}
            onClick={requestSkip}
            fontSize={["xs", "xs", "sm", "md"]}
            size={"sm"}
            px={6}
            mr={2}
            colorScheme="yellow"
            _focus={{ boxShadow: "none" }}
        >
            Skip
        </Button>
    )
}

const DownloadButton: FC = () => {
    const { queue } = useRoomContext()
    const song = queue[0]
    const download = useCallback(() => {
        if (!song) return
        DownloadService.downloadFile(song.fileName)
    }, [song])
    return (
        <Button
            onClick={download}
            disabled={!song}
            fontSize={["xs", "xs", "sm", "md"]}
            size={"sm"}
            px={6}
            mr={2}
            colorScheme="yellow"
            _focus={{ boxShadow: "none" }}
        >
            <Icon as={FaDownload} />
        </Button>
    )
}
const CopyButton: FC = () => {
    const { queue } = useRoomContext()
    const successToast = useSuccessToast()
    const song = queue[0]
    const copy = useCallback(() => {
        if (!song) return
        const { youtubeUrl, title } = song
        successToast({
            title: "Copied",
            description: `YouTube URL of ${title} has been copied to clipboard`,
        })
        navigator.clipboard.writeText(youtubeUrl)
    }, [song])

    return (
        <Button
            disabled={!song}
            onClick={copy}
            fontSize={["xs", "xs", "sm", "md"]}
            size={"sm"}
            px={6}
            mr={2}
            colorScheme="yellow"
            _focus={{ boxShadow: "none" }}
        >
            <Icon as={FaLink} />
        </Button>
    )
}
const SongPlayer: FC = () => {
    const socket = useSocket()
    const {
        queue,
        addSong,
        nextSong,
        playingRef,
        volume,
        setVolume,
        currentTime,
        setCurrentTime,
        muted,
    } = useRoomContext()
    const audioRef = useRef<HTMLAudioElement>(null)
    const [autoplayBlocked, setAutoplayBlocked] = useState(false)

    const playCurrentSong = useCallback(async () => {
        const audio = audioRef.current
        if (!audio) return
        const song = queue[0]
        // console.log(song)
        if (!song) {
            audio.src = ""
            playingRef.current = false
            return
        }
        const { fileName, startTime } = song
        const url = StaticService.getMp3Url(fileName)
        audio.src = url
        audio.load()
        try {
            await audio.play()
            audio.currentTime = startTime ? Date.now() / 1000 - startTime : 0
            playingRef.current = true
            setAutoplayBlocked(false)
        } catch (e) {
            setAutoplayBlocked(true)
        }
    }, [queue.length])

    const onSliderChange = (value: number) => {
        setVolume(value / 100)
    }
    useEffect(() => {
        setCurrentTime(0)
    }, [])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return
        audio.volume = volume
    }, [volume])

    useEffect(() => {
        const audio = audioRef.current
        if (!audio) return

        const onTimeUpdate = () => {
            setCurrentTime(Math.max(Math.floor(audio.currentTime), 0))
        }
        audio.addEventListener("timeupdate", onTimeUpdate)

        const songAdded = ({ song }: { song: Song }) => {
            addSong(song)
        }

        const onNextSong = () => {
            // Shift to next song
            // console.log('nextSong')
            playingRef.current = false
            nextSong()
        }
        const onFastForward = ({ song }: { song: Song }) => {
            audio.currentTime = song.startTime
                ? Date.now() / 1000 - song.startTime
                : 0
        }

        socket.on(SONG_ADDED, songAdded)
        socket.on(NEXT_SONG, onNextSong)
        socket.on(FAST_FORWARD, onFastForward)

        return () => {
            socket.off(SONG_ADDED, songAdded)
            socket.off(NEXT_SONG, onNextSong)
            socket.off(FAST_FORWARD, onFastForward)
        }
    }, [])

    useEffect(() => {
        if (!playingRef.current) {
            playCurrentSong()
        }
    }, [queue.length])

    const currentSong = queue[0]
    const {
        title = "Title",
        author = "Channel",
        length,
        thumbnailUrl,
    } = currentSong || {}

    return (
        <Flex
            direction="column"
            justify="center"
            bgColor={"gray.900"}
            w="100%"
            p={6}
        >
            <audio ref={audioRef} muted={muted} autoPlay />
            {autoplayBlocked ? (
                <Button
                    onClick={playCurrentSong}
                    colorScheme={"purple"}
                    width={"fit-content"}
                    alignSelf={"center"}
                    my="auto"
                    size="lg"
                >
                    Listen
                </Button>
            ) : (
                <Flex
                    py={2}
                    overflowY={"hidden"}
                    overflowX={"auto"}
                    align="center"
                >
                    <Image
                        bgColor={"white"}
                        visibility={thumbnailUrl ? "visible" : "hidden"}
                        src={thumbnailUrl}
                        boxSize={"150px"}
                        objectFit={"cover"}
                        borderRadius={"full"}
                    />
                    <Box pl={4} width={"calc(100% - 150px)"}>
                        <Box mb={2}>
                            <Text
                                color="green.main"
                                isTruncated
                                fontWeight={"bold"}
                                fontSize={"xl"}
                            >
                                {title}
                            </Text>
                            <Text color="purple.lighter" isTruncated>
                                {author}
                            </Text>
                        </Box>
                        <Slider
                            mb={2}
                            value={currentTime}
                            min={0}
                            max={length}
                            isReadOnly
                            cursor={"default"}
                        >
                            <SliderTrack
                                borderRadius={"2xl"}
                                bgColor={"green.lighter"}
                                height={"10px"}
                            >
                                <SliderFilledTrack bgColor={"green.main"} />
                            </SliderTrack>
                        </Slider>
                        <Flex color="white" fontWeight={"bold"} align="center">
                            <Text mr="auto">{formatTimeMMSS(currentTime)}</Text>
                            <Text ml="auto">{formatTimeMMSS(length)}</Text>
                        </Flex>

                        <Flex align="center" w={["100%"]}>
                            <Slider
                                value={volume * 100}
                                min={0}
                                max={100}
                                onChange={onSliderChange}
                                mr={2}
                            >
                                <SliderTrack
                                    borderRadius={"full"}
                                    bgColor={"purple.light"}
                                >
                                    <SliderFilledTrack
                                        bgColor={"purple.main"}
                                    />
                                </SliderTrack>
                                <SliderThumb
                                    _focus={{ boxShadow: "none" }}
                                    bgColor={"purple.main"}
                                />
                            </Slider>
                            <MuteButton />
                        </Flex>
                        <Flex w="100%">
                            <SkipButton />
                            <CopyButton />
                            <DownloadButton />
                        </Flex>
                    </Box>
                </Flex>
            )}
        </Flex>
    )
}

export default SongPlayer

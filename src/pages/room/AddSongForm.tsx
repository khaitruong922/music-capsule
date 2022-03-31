import {
    Button,
    chakra,
    Flex,
    FormControl,
    Input,
    Text,
} from "@chakra-ui/react"
import {
    FC,
    FormEvent,
    KeyboardEventHandler,
    useCallback,
    useEffect,
    useState,
} from "react"
import {
    ADD_SONG,
    ADD_SONG_FAILED,
    ADD_SONG_SUCCESS,
} from "src/common/constants/stream.event"
import { Song } from "src/common/core/stream/stream.interface"
import useInput from "src/common/hooks/useInput"
import { useErrorToast, useSuccessToast } from "src/components/shared/toast"
import { useRoomContext } from "src/contexts/RoomContext"
import { useSocket } from "src/contexts/SocketContext"

const AddSongForm: FC = () => {
    const socket = useSocket()
    const { loading } = useRoomContext()
    const [submitting, setSubmitting] = useState(false)
    const errorToast = useErrorToast()
    const successToast = useSuccessToast()

    const {
        value: url,
        onInput: onUrlInput,
        reset: resetUrlInput,
        setValue: setUrlInput,
    } = useInput("")

    const {
        value: playbackSpeedInput,
        onInput: onPlaybackSpeedInput,
        reset: resetPlaybackSpeedInput,
        setValue: setPlaybackSpeedInput,
    } = useInput("1.00")
    const {
        value: semitoneShiftInput,
        onInput: onSemitoneShiftInput,
        reset: resetSemitoneShiftInput,
    } = useInput("0")

    const getBestSpeed = useCallback(() => {
        return Math.pow(2, Number(semitoneShiftInput) / 12).toFixed(2)
    }, [semitoneShiftInput])

    const setBestPlaybackSpeed = useCallback(() => {
        const bestSpeed = getBestSpeed()
        setPlaybackSpeedInput(String(bestSpeed))
    }, [semitoneShiftInput])

    const addSong = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setSubmitting(true)
        socket.emit(ADD_SONG, {
            url,
            playbackSpeed: playbackSpeedInput ? Number(playbackSpeedInput) : 1,
            semitoneShift: semitoneShiftInput ? Number(semitoneShiftInput) : 0,
        })
    }

    useEffect(() => {
        const addSongSuccess = ({ song }: { song: Song }) => {
            setSubmitting(false)
            successToast({
                title: "Add song successfully",
                description: `${song.title} has been added to queue`,
            })
        }
        const addSongFailed = ({ message }: { message: string }) => {
            setSubmitting(false)
            errorToast({
                title: "Add song failed",
                description: message,
            })
        }
        socket.on(ADD_SONG_SUCCESS, addSongSuccess)
        socket.on(ADD_SONG_FAILED, addSongFailed)
        return () => {
            socket.off(ADD_SONG_SUCCESS, addSongSuccess)
            socket.off(ADD_SONG_FAILED, addSongFailed)
        }
    }, [])

    useEffect(() => {
        if (loading) return
    }, [loading])

    return (
        <chakra.form color="white" onSubmit={addSong}>
            <Flex>
                <Input
                    value={url}
                    onInput={onUrlInput}
                    placeholder="Search YouTube / Insert YouTube URL *"
                    borderColor="green.light"
                    focusBorderColor="green.main"
                    borderRadius={"sm"}
                    mr={2}
                    isRequired
                />
                <Button
                    _focus={{ boxShadow: "none" }}
                    colorScheme={"whatsapp"}
                    type="submit"
                    isLoading={submitting}
                    width={"fit-content"}
                    px={6}
                    fontSize={["sm", "sm", "sm", "sm"]}
                >
                    Add
                </Button>
            </Flex>

            <FormControl mt={2} alignItems={"center"} display={"flex"}>
                <Text isTruncated w="240px" mr={2}>
                    Semitone shift (-12 -&gt; +12)
                </Text>
                <Input
                    w="60px"
                    color="white"
                    value={semitoneShiftInput}
                    onInput={onSemitoneShiftInput}
                    placeholder="0"
                    borderColor="purple.light"
                    focusBorderColor="purple.main"
                    borderRadius={"sm"}
                    type="number"
                    size="sm"
                    min={-12}
                    step={1}
                    max={12}
                    mr={2}
                />
                <Button
                    _focus={{ boxShadow: "none" }}
                    colorScheme={"purple"}
                    onClick={resetSemitoneShiftInput}
                    width={"fit-content"}
                    size="sm"
                    fontSize={["sm", "sm", "sm", "sm"]}
                >
                    Reset
                </Button>
            </FormControl>
            <FormControl mt={2} alignItems={"center"} display={"flex"}>
                <Text isTruncated w="240px" mr={2}>
                    Playback speed (0.25 -&gt; 2.00)
                </Text>
                <Input
                    w="60px"
                    color="white"
                    value={playbackSpeedInput}
                    onInput={onPlaybackSpeedInput}
                    placeholder="1"
                    borderColor="purple.light"
                    focusBorderColor="purple.main"
                    borderRadius={"sm"}
                    type="number"
                    size="sm"
                    min={0.25}
                    step={0.01}
                    max={2.0}
                    mr={2}
                />
                <Button
                    _focus={{ boxShadow: "none" }}
                    colorScheme={"purple"}
                    onClick={resetPlaybackSpeedInput}
                    width={"fit-content"}
                    size="sm"
                    fontSize={["sm", "sm", "sm", "sm"]}
                    mr={2}
                >
                    Reset
                </Button>
                <Button
                    onClick={setBestPlaybackSpeed}
                    _focus={{ boxShadow: "none" }}
                    colorScheme={"whatsapp"}
                    width={"fit-content"}
                    size="sm"
                    fontSize={["sm", "sm", "sm", "sm"]}
                    title="Select best playback speed with selected pitch"
                >
                    Best
                </Button>
            </FormControl>
        </chakra.form>
    )
}

export default AddSongForm

import { Box, Flex, Icon, Text } from "@chakra-ui/react"
import { FC } from "react"
import { BiHeadphone } from "react-icons/bi"
import { Link } from "react-router-dom"
import { LobbyRoomResponse } from "src/common/core/lobby/lobby.interface"
interface Props {
    room: LobbyRoomResponse
}
const RoomCard: FC<Props> = ({ room }) => {
    const { id: roomId, name, userCount, nowPlaying } = room
    const { title, thumbnailUrl } = nowPlaying || {}
    return (
        <Link to={`/${roomId}`}>
            <Box cursor={"pointer"} shadow={"md"} height="200px">
                <Box
                    bgColor={"white"}
                    bgImage={thumbnailUrl}
                    width="100%"
                    h="100%"
                    backgroundSize="cover"
                    backgroundRepeat="no-repeat"
                    backgroundPosition="center"
                >
                    <Box
                        p={4}
                        color="white"
                        h="100%"
                        bgColor={"blackAlpha.800"}
                        _hover={{ backgroundColor: "blackAlpha.900" }}
                    >
                        <Text
                            color="green.main"
                            isTruncated
                            fontSize={"xl"}
                            fontWeight={600}
                        >
                            {name}
                        </Text>
                        <Text
                            my={1}
                            color="purple.lighter"
                            noOfLines={2}
                            fontSize={"md"}
                        >
                            Now playing: {title}
                        </Text>
                        <Flex overflowX="hidden" align="center">
                            <Icon boxSize={"25px"} as={BiHeadphone} mr={1} />
                            <Text fontWeight={600} fontSize={"lg"}>
                                {userCount}
                            </Text>
                        </Flex>
                    </Box>
                </Box>
            </Box>
        </Link>
    )
}

export default RoomCard

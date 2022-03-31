import { Flex, Icon, Text } from "@chakra-ui/react"
import { FC } from "react"
import { BiHeadphone } from "react-icons/bi"
import { useRoomContext } from "src/contexts/RoomContext"

const RoomHeader: FC = () => {
    const { room, users } = useRoomContext()
    return (
        <Flex
            py={4}
            px={6}
            w="100%"
            justify="center"
            bgColor={"gray.900"}
            color={"white"}
        >
            <Text isTruncated fontSize="2xl" fontWeight={600}>
                {room?.name}
            </Text>
            <Flex ml="auto" overflowX="hidden" align="center">
                <Icon boxSize={"25px"} as={BiHeadphone} mr={2} />
                <Text fontSize="2xl" fontWeight={600}>
                    {Object.keys(users).length}
                </Text>
            </Flex>
        </Flex>
    )
}

export default RoomHeader

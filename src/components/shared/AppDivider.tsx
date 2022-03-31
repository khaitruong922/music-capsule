import { chakra } from "@chakra-ui/react"
import { FC } from "react"

const AppDivider: FC = () => {
    return (
        <chakra.hr
            color="gray.700"
            borderTopColor={"gray.700"}
            borderTop={"1px"}
        />
    )
}

export default AppDivider

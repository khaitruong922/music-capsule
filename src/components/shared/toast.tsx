import { useToast } from "@chakra-ui/react"

type Status = "info" | "warning" | "success" | "error" | undefined
interface ToastInfo {
    title: string
    description?: string
}

const createToast = (status: Status) => {
    return () => {
        const toast = useToast()
        return ({ title, description }: ToastInfo) =>
            toast({
                position: "bottom-right",
                isClosable: true,
                duration: 4000,
                status,
                title,
                description,
            })
    }
}

export const useErrorToast = createToast("error")
export const useSuccessToast = createToast("success")

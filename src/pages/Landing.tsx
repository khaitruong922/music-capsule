import { Box, Button, chakra, Flex, Input, Text } from '@chakra-ui/react'
import { FC, FormEvent, useEffect } from 'react'
import useInput from 'src/common/hooks/useInput'
import { generateRandomName } from 'src/common/utils/random'
import { NAME_MAX_LENGTH } from 'src/common/utils/string'
import { useUserContext } from 'src/contexts/UserContext'

const Landing: FC = () => {
	const { name, setName } = useUserContext()
	const { value: nameInput, onInput: onNameInput } = useInput(
		name ?? generateRandomName(),
	)
	useEffect(() => {}, [])

	const onFormSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setName(nameInput)
	}

	return (
		<Flex
			direction={'column'}
			align="center"
			justify="center"
			h="100%"
			borderTop={'1px'}
			borderTopColor={'gray.700'}
			bgColor={'gray.900'}
			color="white"
		>
			<Text fontSize="3xl" align="center">
				The most amazing music streaming platform
			</Text>
			<chakra.form
				mt={4}
				alignItems="center"
				display="flex"
				flexDirection="column"
				onSubmit={onFormSubmit}
			>
				<Input
					borderRadius="2xl"
					textAlign="center"
					placeholder="Enter your name"
					borderColor="purple.light"
					focusBorderColor="purple.main"
					w="300px"
					value={nameInput}
					onInput={onNameInput}
					isRequired
					maxLength={NAME_MAX_LENGTH}
				/>
				<Button
					borderRadius="2xl"
					mt={4}
					width="fit-content"
					colorScheme="purple"
					type="submit"
					_focus={{ boxShadow: 'none' }}
				>
					Join now
				</Button>
			</chakra.form>
		</Flex>
	)
}

export default Landing

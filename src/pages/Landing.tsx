import { Button, chakra, Flex, Input, Text } from '@chakra-ui/react'
import { FC, FormEvent, useEffect } from 'react'
import useInput from 'src/common/hooks/useInput'
import { generateRandomName } from 'src/common/util/random'
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
		localStorage.setItem('name', nameInput)
	}

	return (
		<Flex direction="column" justify="center" align="center" flex={1}>
			<Text fontSize="xl" align="center">
				The most awesome music streaming platform
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

import { FormEvent, useState } from 'react'

const useInput = (initialValue: string) => {
	const [value, setValue] = useState<string>(initialValue)

	const handleChange = (event: FormEvent<HTMLInputElement>) =>
		setValue(event.currentTarget.value)

	const reset = () => setValue(initialValue)

	return {
		value,
		setValue,
		onInput: handleChange,
		reset,
	}
}

export default useInput

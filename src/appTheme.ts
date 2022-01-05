import { extendTheme } from '@chakra-ui/react'
import { createBreakpoints } from '@chakra-ui/theme-tools'

const breakpoints = createBreakpoints({
	sm: '40em',
	md: '56em',
	lg: '72em',
	xl: '90em',
	'2xl': '100em',
})

const appTheme = extendTheme({
	fonts: {
		body: `Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, 
        Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif`,
	},
	colors: {
		green: {
			lightest: '#d6ffe6',
			lighter: '#adffcc',
			light: '#91ff93',
			main: '#57ff97',
		},
		purple: {
			white: '#f3e0ff',
			lightest: '#f5d9ff',
			lighter: '#dea1ff',
			light: '#9F7AEA',
			main: '#805AD5',
			dark: '#2c1c45',
		},
		orange: {
			lightest: '#ffeadb',
			light: '#ffbe8f',
			main: '#ff9142',
		},
		blue: {
			lightest: '#d6dcff',
		},
		pink: {
			lightest: '#ffd9f6',
			light: '#ffccf3',
		},
		red: {
			main: '#ff6b7c',
			light: '#ffa1ab',
		},
	},
	breakpoints,
})

export default appTheme

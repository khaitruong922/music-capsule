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
			light: '#91ff93',
			main: '#5cff7a',
		},
		purple: {
			lightest: '#f5d9ff',
			light: '#9F7AEA',
			main: '#805AD5',
		},
	},
	breakpoints,
})

export default appTheme

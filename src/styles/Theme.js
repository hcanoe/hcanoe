import { extendTheme } from '@chakra-ui/react'

const Theme = extendTheme({
  shadows: { outline: '0 !important' },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
})

export default Theme

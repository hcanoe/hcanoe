import { extendTheme, Accordion } from '@chakra-ui/react'

const Theme = extendTheme({
  shadows: { outline: '0 !important' },
  fonts: {
    heading: 'Inter',
    body: 'Inter',
  },
  components: {
    Tabs: {
      baseStyle: {
        tab: {
          color: 'red.500',
          _selected: {
            color: 'blue.500',
          },
        },
      },
      variants: {
        enclosed: {
          tab: {
            color: 'gray.600',
            whiteSpace: 'nowrap',
            _selected: {
              color: 'primary',
              fontWeight: '600',
              whiteSpace: 'nowrap',
            },
          },
        },
      },
    },
  },
  colors: {
    primary: '#429E90',
  },
})

export default Theme

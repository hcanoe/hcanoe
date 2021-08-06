import { extendTheme } from '@chakra-ui/react'

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
            color: 'blue.500'
          },
        }
      },
      variants: {
        enclosed: {
          tab: {
            color: 'gray.600',
            _selected : { 
              color: 'gray.500',
              fontWeight: '500',
            }
          }
        }
      }
    },
  },
  colors: {
    primary: '#429E90',
  },
})

export default Theme

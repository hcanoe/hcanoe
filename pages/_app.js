import { ChakraProvider } from '@chakra-ui/react'
import "@fontsource/inter/400.css"
import "@fontsource/inter/700.css"
import Theme from '@styles/Theme'

export default function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={Theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

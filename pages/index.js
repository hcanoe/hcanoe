import {
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  Flex,
  Container,
  Center,
  Text,
  Input,
} from '@chakra-ui/react'
import { useState } from 'react'

export default function Page({ log }) {
  const [year, setYear] = useState('18')
  const [name, setName] = useState('nguyen-vu-khang')
  const handleChangeYear = (e) => {
    setYear(e.target.value)
  }
  const handleChangeName = (e) => {
    setName(e.target.value)
  }
  const onFocusYear = (e) => {
    const field = e.target.parentNode
    field.removeAttribute('readonly')
  }
  const user_url = {
    fontSize: '1.1em',
    marginTop: '100px',
  }
  return (
    <Flex h="100vh" w="100vw">
      <Center w="inherit" alignItems="center">
        <Container>
          <Text
            align="center"
            bgGradient="linear(to-r,blue.500, teal.500, green.500)"
            bgClip="text"
            fontSize="2xl"
            fontWeight="500"
            align="center"
          >
            <code>HCANOE</code>
          </Text>
          <Text
            bgGradient="linear(to-r,blue.500, teal.500, green.500)"
            bgClip="text"
            fontSize="3xl"
            fontWeight="500"
            align="center"
          >
            团结一心
            <br />
            自强不息
            <br />
          </Text>
          <Box align="center" mt="2em">
            <Box width="20rem">
              <FormControl>
                <FormLabel>Graduation Year</FormLabel>
                <Input
                  maxLength="2"
                  readonly
                  autoComplete="off"
                  value={year}
                  onFocus={onFocusYear}
                  onChange={handleChangeYear}
                />
                <FormLabel mt="1em">Name</FormLabel>
                <Input value={name} onChange={handleChangeName} />
              </FormControl>
            </Box>
          </Box>
          <Text
            align="center"
            bgGradient="linear(to-r,blue.500, teal.500, green.500)"
            bgClip="text"
            fontSize="lg"
            fontWeight="500"
            align="center"
            mt="2em"
          >
            <code style={user_url}>
              <a href={'https://hcanoe.vercel.app/' + year + '/' + name}>
                hcanoe.vercel.app/{year}/nguyen-vu-khang
              </a>
            </code>
          </Text>
        </Container>
      </Center>
    </Flex>
  )
}
// <Center w="inherit" alignItems="center">

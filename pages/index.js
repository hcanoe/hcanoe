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

const dashify = (str) => {
  return str.replace(/ /g, '-').toLowerCase()
}

export default function Page({ log }) {
  const [year, setYear] = useState('18')
  const [name, setName] = useState('nguyen vu khang')
  const handleChangeYear = (e) => {
    setYear(e.target.value)
  }
  const handleChangeName = (e) => {
    setName(e.target.value)
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
            color="gray.600"
            fontSize="2xl"
            fontWeight="600"
            align="center"
          >
            <code>HCANOE</code>
          </Text>
          <Text
            mt='0.5em'
            bgGradient="linear(to-r,blue.500, teal.500, green.500)"
            bgClip="text"
            fontSize="3xl"
            fontWeight="600"
            align="center"
          >
            团结一心
            <br />
            自强不息
            <br />
          </Text>
          <Box align="center" mt="4em">
            <Box width="18rem">
              <FormControl>
                <FormLabel>Graduation Year</FormLabel>
                <NumberInput max={99} min={0}>
                  <NumberInputField maxLength={2} placeholder={year}/>
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormLabel mt="1em">Name</FormLabel>
                <Input
                  placeholder={name}
                  maxLength="20"
                  onChange={handleChangeName}
                />
              </FormControl>
            </Box>
          </Box>
          <Text align="center" mt="2em">
            See your data at
          </Text>
          <Text
            align="center"
            bgGradient="linear(to-r,blue.500, teal.500, green.500)"
            bgClip="text"
            fontSize="lg"
            fontWeight="500"
            align="center"
          >
            <code style={user_url}>
              <a href={'https://hcanoe.vercel.app/' + year + '/' + name}>
                hcanoe.vercel.app/{year}/{dashify(name)}
              </a>
            </code>
          </Text>
        </Container>
      </Center>
    </Flex>
  )
}
// <Center w="inherit" alignItems="center">

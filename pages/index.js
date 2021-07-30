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
  Link as ChakraLink,
} from '@chakra-ui/react'
import { useState } from 'react'
import Link from 'next/link'

const dashify = (str) => {
  return str.replace(/ /g, '-').toLowerCase()
}

export default function Page({ log }) {
  const [year, setYear] = useState('')
  const [url_year, setUrl_year] = useState('18')
  const [name, setName] = useState('nguyen vu khang')
  const handleChangeYear = (e) => {
    if (e < 10) {
      setYear('0' + e)
      setUrl_year('0' + e)
    } else {
      setYear(e)
      setUrl_year(e)
    }
  }
  const handleChangeName = (e) => {
    setName(e.target.value)
  }
  const user_url = {
    fontSize: '1.1em',
    fontFamily: 'monospace',
    marginTop: '100px',
  }
  return (
    <Flex h="100vh" w="100vw">
      <Center w="inherit" alignItems="center">
        <Container>
          <Text
            align="center"
            color="gray.600"
            fontSize="5xl"
            fontWeight="900"
            align="center"
            bgGradient="linear(to-r,blue.700, green.400)"
            bgClip="text"
          >
            HCANOE
          </Text>
          <Box align="center" mt="4em">
            <Box width="18rem">
              <FormControl>
                <FormLabel>Graduation Year</FormLabel>
                <NumberInput
                  id='GraduationYear'
                  max={99}
                  min={0}
                  value={year}
                  onChange={handleChangeYear}
                >
                  <NumberInputField maxLength={2} placeholder={18} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormLabel mt="1em">Name</FormLabel>
                <Input
                  id='Name'
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
            bgGradient="linear(to-r,blue.700, green.400)"
            bgClip="text"
            fontSize="lg"
            fontWeight="500"
            align="center"
          >
            <Link
              href={'https://hcanoe.vercel.app/' + year + '/' + dashify(name)}
            >
              <a style={user_url} className="home_to_user_url">
                hcanoe.vercel.app/{url_year}/{dashify(name)}
              </a>
            </Link>
          </Text>
        </Container>
      </Center>
    </Flex>
  )
}

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
  Link,
} from '@chakra-ui/react'
import { useState } from 'react'
import styles from 'styles/Homepage.module.css'
import Router from 'next/router'

const dashify = (str) => {
  return str.replace(/ /g, '-').toLowerCase()
}

export default function Page({ log }) {
  const [year, setYear] = useState('')
  const [url_year, setUrl_year] = useState('18')
  const [name, setName] = useState('nguyen vu khang')
  const handleChangeYear = (e) => {
    if (e < 10) {
      setUrl_year('0' + e)
    } else {
      setUrl_year(e)
    }
    setYear(e)
  }
  const handleChangeName = (e) => {
    setName(e.target.value)
  }
  const user_url = {
    fontSize: '1.1em',
    fontFamily: 'monospace',
    marginTop: '100px',
  }
  const goToUrl = (e) => {
    if (e.key == 'Enter') {
      window.open(url_year + '/' + dashify(name), "_self")
    }
  }
  return (
    <Flex h="100vh" w="100vw">
      <Center w="inherit" alignItems="center">
        <Container>
          <Text
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
                  onKeyPress={goToUrl}
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
              <a
              href={url_year + '/' + dashify(name)}
                className={styles.home_to_user_url}>
                hcanoe.vercel.app/{url_year}/{dashify(name)}
              </a>
          </Text>
        </Container>
      </Center>
    </Flex>
  )
}

import spreadsheet_ids from '@root/spreadsheets'
import { google } from 'googleapis'
import { team } from 'team'
import {
  Container,
  Heading,
  Text,
  Select,
  Tabs,
  SimpleGrid,
  Box,
  TabList,
  TabPanels,
  Tab,
  VStack,
  TabPanel,
  Center,
  Divider,
  HStack,
} from '@chakra-ui/react'

export async function getServerSideProps({ query }) {
  // necessary google auth code

  const credentials = {
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  }
  const scopes = ['https://www.googleapis.com/auth/spreadsheets.readonly']
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes,
  })
  const sheets = google.sheets({ version: 'v4', auth })

  const response = await team(query, sheets)

  return {
    props: response,
  }
}

const Page = ({ metadata }) => {
  console.log(metadata)
  const Title = () => {
    return (
      <Text mt="1em" color="primary" fontSize="3xl" fontWeight="800">
        Team Stats
      </Text>
    )
  }
  const Day = () => {
    const size = 12
    return (
      <Box borderRadius="2px" w='12px' h='12px' bg="blue.500" />
    )
  }
  const weeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  const days = [1, 2, 3, 4, 5, 6, 7]
  return (
    <>
      <Container size="md" mb="2">
        <HStack mt='57px' spacing="4px" height='200px'>
          {weeks.map((w) => (
            <VStack spacing="4px" width='14px'>
              {days.map((d) => (
                <Day />
              ))}
            </VStack>
          ))}
        </HStack>
      </Container>
    </>
  )
}

export default Page

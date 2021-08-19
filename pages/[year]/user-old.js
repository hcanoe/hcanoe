import { google } from 'googleapis'
import { main } from 'main'
import {
  Container,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center, } from '@chakra-ui/react'
import {
  OnOffTable,
  TimedTable,
} from 'components/Table'
import Intervals from 'components/Intervals'
import Distance from 'components/Distance'
import BestSplits from 'components/BestSplits'
import { Title, Name } from 'components/Typography'
import { HomeButton } from 'components/Buttons'

export async function getServerSideProps({ query }) {
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
  const response = await main(query, sheets)
  return {
    props: response,
  }
}

const Page = ({ display_name, distance, intervals, on_off, timed, best, cat }) => {
  return (
    <>
      <Container size="md" mb="2">

        <Title t="Training Stats"/>
        <Name n={display_name}/>

        <BestSplits best={best} cat={cat}/>
        <Tabs variant="enclosed" colorScheme="teal" isFitted>
          <TabList mb="1.6em">
            <Tab>Distance</Tab>
            <Tab>Intervals</Tab>
            <Tab>On-Off</Tab>
            <Tab>Timed</Tab>
          </TabList>
          <TabPanels>
            <TabPanel p="0">
              <Distance rows={distance} />
            </TabPanel>
            <TabPanel p="0">
              <Intervals rows={intervals} />
            </TabPanel>
            <TabPanel p="0">
              <OnOffTable rows={on_off} />
            </TabPanel>
            <TabPanel p="0">
              <TimedTable rows={timed} />
            </TabPanel>
          </TabPanels>
        </Tabs>

      </Container>

      <Center h="100" color="teal.500">
        <HomeButton />
      </Center>
    </>
  )
}

export default Page

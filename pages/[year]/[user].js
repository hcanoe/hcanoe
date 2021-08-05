import spreadsheet_ids from '@root/spreadsheets'
import { google } from 'googleapis'
import { main } from 'main'
import {
  Container,
  Heading,
  Text,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import {
  DistanceTable,
  IntervalsTable,
  OnOffTable,
  TimedTable,
} from 'components/Table'
import { useState } from 'react'

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

  const response = await main(query, sheets)

  return {
    props: response,
  }
}

const Page = ({ display_name, distance, intervals, on_off, timed }) => {
  const [type, setType] = useState('DISTANCE')
  const Title = () => {
    return (
      <Text mt="1em" color="#429E90" fontSize="3xl" fontWeight="800">
        Training Stats
      </Text>
    )
  }
  const DataTable = ({ type }) => {
    const d = {}
    const i = {
      display: 'none',
      backgroundColor: 'red',
      textDecoration: 'underline',
    }
    const o = {
      display: function () {
        return type === 'ONOFF' ? 'block' : 'none'
      },
    }
    const t = {
      display: function () {
        return type === 'TIMED' ? 'block' : 'none'
      },
    }
    return (
      <>
        {type === 'DISTANCE' ? <DistanceTable rows={distance} /> : null}
        {type === 'INTERVALS' ? <IntervalsTable rows={intervals} /> : null}
        {type === 'ONOFF' ? <OnOffTable rows={on_off} /> : null}
        {type === 'TIMED' ? <TimedTable rows={timed} /> : null}
      </>
    )
  }
  const changeType = (e) => {
    console.log(e.target.value)
    setType(e.target.value)
  }
  return (
    <>
      <Container size="md">
        <Title />
        <Text color="gray.500" mb="10">
          {display_name}
        </Text>
        <Tabs variant='line' colorScheme='teal' isFitted>
          <TabList>
            <Tab>Distance</Tab>
            <Tab>Intervals</Tab>
            <Tab>On-Off</Tab>
            <Tab>Timed</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p='0'>
              <DistanceTable rows={distance} />
            </TabPanel>
            <TabPanel p='0'>
              <IntervalsTable rows={intervals} />
            </TabPanel>
            <TabPanel p='0'>
              <OnOffTable rows={on_off} />
            </TabPanel>
            <TabPanel p='0'>
              <TimedTable rows={timed} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </>
  )
}

export default Page

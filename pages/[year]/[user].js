import spreadsheet_ids from '@root/spreadsheets'
import { google } from 'googleapis'
import { main } from 'main'
import { Container, Heading, Text } from '@chakra-ui/react'
import { DistanceTable, IntervalsTable, OnOffTable } from 'components/Table'

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

const Page = ({ display_name, distance, intervals, on_off }) => {
  return (
    <>
      <Container size="md">
        <Text mt="1em" color="#429E90" fontSize="3xl" fontWeight="800">
          Training Stats
        </Text>
        <Text color="gray.500">{display_name}</Text>
        <DistanceTable rows={distance} />
        <IntervalsTable rows={intervals} />
        <OnOffTable rows={on_off} />
      </Container>
    </>
  )
}

export default Page

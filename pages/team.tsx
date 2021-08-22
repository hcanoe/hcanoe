import { google } from 'googleapis'
import { team } from 'team'

export async function getServerSideProps() {
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
  const response = await team(sheets)
  return {
    props: response,
  }
}

const Page = ({ log }) => {
  console.log('===================================')
  console.log('browser log: ', log)
  console.log('===================================')
  return (
    <>
      <h1>Team Page</h1>
    </>
  )
}

export default Page

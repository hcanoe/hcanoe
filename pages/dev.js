import { google } from 'googleapis'
import sheetIDs from '@root/sheets'

export async function getServerSideProps({ query }) {
  /*
   * Google Authentication
   *
   * secret strings can be found in
   * >> .env.local -> for localhost deployment
   * >> vercel.com -> for production deployment
   */
  const { user } = query
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  const sheets = google.sheets({ version: 'v4', auth })

  const log = []

  /*
   * defining variables to use in Sheets API requests
   */
  const spreadsheetId = '17edrD9OALK56qoQoP_4DDwQdfpNBhH5P8NOyS0sKm2c'
  const range = `data!A:D`

  /*
   * spreadsheet.values.get
   *
   * always just take the [data] prop of the response
   * >> response.data
   *
   * taking the response as a whole will somehow throw an error
   * >> console.log(response)      -> error
   * >> console.log(response.data) -> okie
   */

  const response_svg = (
    await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })
  ).data

  /*
   * spreadsheet.get
   * 
   * again, always take the [data] prop
   */
  const response_sg = (
    await sheets.spreadsheets.get({
      spreadsheetId,
    })
  ).data
  
  log.push(response_sg)

  if (typeof log == 'undefined') {
    log = '(empty log)'
  }
  return {
    props: {
      log,
    },
  }
}

const Page = ({ log, user }) => {
  const Log = JSON.stringify(log, null, 4)
  // console.log('=============================')
  // console.log('-- Log', Log)
  const style = {
    fontFamily: 'Courier New',
    fontSize: 13,
  }

  return (
    <>
      <pre style={style}>{Log}</pre>
      <pre style={style}>
        note that console's log may appear differently from the above.
      </pre>
      <p style={style}>I am {user}</p>
    </>
  )
}

export default Page

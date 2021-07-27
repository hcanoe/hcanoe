import sheetIDs from '@root/sheets'
import {
  searchUser,
  generateUserObject,
  expandActiveYears,
  getActiveSheets,
} from '@utils/user-meta'

import { google } from 'googleapis'
export async function getServerSideProps({ query }) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
      private_key: process.env.GOOGLE_PRIVATE_KEY
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  const sheets = google.sheets({ version: 'v4', auth })

  const range = `data!A:D`

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetIDs.meta,
    range,
  })

  const log = JSON.stringify(response)

  return {
    props: {
      log,
    },
  }
}

export default function Page({ log }) {
  console.log('process.env', process.env)
  const style = {
    fontFamily: 'Courier New',
  }
  return (
    <>
      <h1>Welcome to HCanoe!</h1>
      <p style={style}>{log}</p>
    </>
  )
}

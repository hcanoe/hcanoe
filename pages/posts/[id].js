import { google } from 'googleapis'

export async function getServerSideProps({ query }) {

  const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] })

  const sheets = google.sheets({ version: 'v4', auth })

  const { id } = query
  const range = `Sheet1!A${id}:B${id}`

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID, range
  })

  const [name, age] = response.data.values[0]
  return {
    props: {
      name,
      age
    }
  }
}

export default function Post ({ name, age }) {
  return <h1>{name}{age}</h1>
}

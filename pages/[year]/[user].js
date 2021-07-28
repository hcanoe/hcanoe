import { google } from 'googleapis'
import spreadsheet_ids from '@root/spreadsheets'
import {
  searchUser,
  generateUserObject,
  expandActiveYears,
  getActiveSheets,
  getIDsToSource,
  zipTable,
} from '@utils/user-meta'
import { makeEnglish } from '@utils/text'

export async function sourceSheetsByID(sheets, idList, log) {
  const result = {}

  await Promise.all(
    idList.map(async (id) => {
      result[id] = {}
      const response = await sheets.spreadsheets.get({
        spreadsheetId: id,
      })
      const sheetData = response.data.sheets
      // log.push(sheetData)

      await Promise.all(
        sheetData.map(async (eachSheetData) => {
          const title = eachSheetData.properties.title
          const r = await getTrainingData(sheets, id, title)
          const trainingData = r.data.values
          result[id][title] = trainingData
        })
      )
      /*
      response.data.sheets.forEach((i) => {
        const title = i.properties.title
        const r = getTrainingData(sheets, id, title)
        result[id][title] = {r}
      })
      */
    })
  )

  return result
}

export async function getTrainingData(sheets, sheetID, sheetTitle) {
  const range = sheetTitle.concat('!A:D')
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetID,
    range,
  })
  return response
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
export async function getServerSideProps({ query }) {
  const log = {}
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
  // end of google auth

  /*
   * grab year and user from url
   * hcanoe.vercel.app/18/ning-yiran
   *   {
   *     year: 18,
   *     user: ning-yiran
   *   }
   */
  const { year, user } = query
  const name = makeEnglish(user)

  /*
   * retrieve user's metadata (Name, Graduation Year)
   *   {
   *     Name,
   *     GradYear
   *   }
   */
  const metadata = (
    await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheet_ids.meta,
      range: `data!A:D`,
    })
  ).data.values

  const metadata_headers = metadata.shift()
  const metadataUser = searchUser(name, year, metadata)
  const userObject = zipTable(metadata_headers, metadataUser)
  // _________________________________________________________________

  log.userObject = userObject
  // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

  /*
  const activeYears = expandActiveYears(userObject)
  const activeSheets = getActiveSheets(activeYears)
  const IDsToSource = getIDsToSource(activeSheets, 'run')
  const trainingData = await sourceSheetsByID(sheets, IDsToSource, log)

  const getUserTrainingData = (trainingData, User) => {
    const result = {}
    for (const sheetID in trainingData) {
      result[sheetID] = {}
      for (const date in trainingData[sheetID]) {
        const rawTable = trainingData[sheetID][date]
        const headers = rawTable.shift()
        const userTrainingData = searchUser(User, rawTable)
        result[sheetID][date] = {headers, userTrainingData}
      }
    }
    return result
  }

  const userTrainingData = getUserTrainingData(trainingData, User)
  */

  log.name = name
  if (typeof log == 'undefined') {
    log = '(empty log)'
  }
  return {
    props: {
      log,
      name,
    },
  }
}

const Page = ({ log }) => {
  console.log(log)
  const Log = JSON.stringify(log, null, 4)
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
      <p style={style}>I am {log.name}</p>
    </>
  )
}

export default Page

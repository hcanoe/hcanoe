import { google } from 'googleapis'
import spreadsheet_ids from '@root/spreadsheets'
import {
  searchUser,
  searchUserInDay,
  generateUserObject,
  getActiveYears,
  getActiveSpreadsheets,
  getSpreadsheetsByType,
  zipTable,
} from '@utils/user-meta'
import { makeEnglish } from '@utils/text'

export async function getAllSheets(sheets, idList, log) {
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
  const metadata_body = searchUser(name, year, metadata)
  const user_metadata = zipTable(metadata_headers, metadata_body)
  // _________________________________________________________________

  const active_years = getActiveYears(user_metadata)
  const active_spreadsheets = getActiveSpreadsheets(active_years)
  const spreadsheet_ids_by_type = getSpreadsheetsByType(
    active_spreadsheets,
    'run'
  )
  const data_all_sheets = await getAllSheets(
    sheets,
    spreadsheet_ids_by_type,
    log
  )
  /*
   * TODO: split array by [">>>"]
   *       use shift() to get headers out
   *       filter for name
   *       zip table
   */
  const getUserTrainingData = (data_all_sheets) => {
    const result = []
    const user_data_by_day = {}
    for (const spreadsheet_id in data_all_sheets) {
      for (const week in data_all_sheets[spreadsheet_id]) {
        const data_week = data_all_sheets[spreadsheet_id][week]
        /*
         * data_week is an array of the week's trainings,
         * with each day separated by a single cell ['>>>']
         */
        var arr = []
        const split_day = {}
        var c = 0
        data_week.forEach((e) => {
          if (e[0] === '>>>') { // the delimiter >>>
            split_day[arr[1][0]] = arr
            c += 1
            arr = []
          } else {
            arr.push(e)
          }
        })
        /*
         * at this point, split_day is an object where each key
         * contains the entire team's data for that day
         */
        user_data_by_day[week] = {}
        for (const day in split_day) {
          const day_arr = split_day[day]
          const headers = day_arr.shift()
          const type = headers.shift()
          const body = searchUserInDay(name, day_arr)
          body.shift()
          const zipped = zipTable(headers, body)
          zipped.type = type
          user_data_by_day[week][day] = zipped
        }
        /*
        const data_day_user = data_day.map((day) => {
          const headers = day.shift()
          const type = headers[0]
          headers[0] = 'Day'
          const body = searchUserInDay(name, day)
          const zipped = zipTable(headers, body)
          zipped.type = type
          return zipped
        })
        result.push('data_day_user', data_day_user)
        */
        log.user_data_by_day = user_data_by_day
      }
    }
    return result
  }
  const data_user = getUserTrainingData(data_all_sheets)

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

import { google } from 'googleapis'
import spreadsheet_ids from '@root/spreadsheets'
import {
  searchUser,
  searchUserInDay,
  getActiveYears,
  getActiveSpreadsheets,
  getSpreadsheetsByType,
  zipTable,
} from '@utils/user-meta'
import { makeEnglish } from '@utils/text'
import { getDate } from '@utils/date'
import { prettifyDistance } from '@utils/display-data'
import { DistanceTable } from 'components/Table'
import FieldBox from 'components/FieldBox'
import { Container } from '@chakra-ui/react'

export async function getAllSheets(sheets, idList) {
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
  const range = sheetTitle.concat('!A:Z')
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
  const data_all_sheets = await getAllSheets(sheets, spreadsheet_ids_by_type)
  /*
   * TODO: split array by [">>>"]
   *       use shift() to get headers out
   *       filter for name
   *       zip table
   */
  const getUserTrainingData = (data_all_sheets) => {
    const user_data_by_day = {}
    const user_data_by_type = {
      DISTANCE: [],
      INTERVALS: [],
      ONOFF: [],
      TIMED: [],
    }
    for (const spreadsheet_id in data_all_sheets) {
      for (const week in data_all_sheets[spreadsheet_id]) {
        const data_week = data_all_sheets[spreadsheet_id][week]
        /*
         * data_week is an array of the week's trainings,
         * with each day separated by a single cell ['>>>']
         */
        const split_day = {}
        var arr = []
        var c = 0
        data_week.forEach((e, index) => {
          if (e[0] === '>>>') {
            // the delimiter >>>
            split_day[arr[1][0]] = arr
            c += 1
            arr = []
          } else if (index == data_week.length - 1) {
            arr.push(e)
            split_day[arr[1][0]] = arr
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
          const date = getDate(week, day)
          const day_arr = split_day[day]
          const headers = day_arr.shift()
          const type = headers.shift()
          const body = searchUserInDay(name, day_arr).slice(1)
          const zipped = zipTable(headers, body)
          zipped.Type = type
          zipped.Date = date
          delete zipped.Name
          user_data_by_type[type].push(zipped)
          user_data_by_day[week][day] = zipped
        }
        /*
         * at this point, user_data_by_day is an object,
         *  key = start of week in DD/MM/YYYY format
         *  props = date of training in DD/MM/YYYY
         */
      }
    }
    return [user_data_by_day, user_data_by_type]
  }
  const [user_data_by_day, user_data_by_type] =
    getUserTrainingData(data_all_sheets)
  for (const type in user_data_by_type) {
    if (type === 'DISTANCE') {
      prettifyDistance(user_data_by_type[type])
    }
  }
  const distance = user_data_by_type.DISTANCE

  if (typeof log == 'undefined') {
    log = '(empty log)'
  }
  return {
    props: {
      log,
      name,
      distance,
    },
  }
}

const Page = ({ distance }) => {
  return (
    // TODO: sort data display by date
    <>
      <Container size='md'>
        <FieldBox t="Distance">
          <DistanceTable rows={distance} />
        </FieldBox>
      </Container>
    </>
  )
}

export default Page

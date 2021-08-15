import spreadsheet_ids from '@root/spreadsheets'
import {
  searchUser,
  searchUserInDay,
  getSpreadsheetsByType,
  zipTable,
} from '@utils/user-meta'
import { makeEnglish, makeNameCaps } from '@utils/text'
import { getDate } from '@utils/date'
import {
  prettifyDistance,
  prettifyIntervals,
  prettifyOnOff,
  prettifyTimed
} from '@utils/prettify-data'

async function getTrainingData(sheets, sheetID, sheetTitle) {
  const range = sheetTitle.concat('!A:Z')
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetID,
    range,
  })
  return response
}

async function getAllSheets(sheets, idList) {
  const result = {}

  await Promise.all(
    idList.map(async (id) => {
      result[id] = {}
      const response = await sheets.spreadsheets.get({
        spreadsheetId: id,
      })
      const sheetData = response.data.sheets

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

async function getMetadata(sheets) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheet_ids.meta,
    range: `data!A:F`,
  })
  return response.data.values
}

const getUserTrainingData = (data_all_sheets, name) => {
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
        const day_arr = split_day[day]
        const headers = day_arr.shift()
        const type = headers.shift()
        const _body = searchUserInDay(name, day_arr)
        if (_body) {
          const date = getDate(week, day)
          const body = _body.slice(1)
          const zipped = zipTable(headers, body)
          zipped.Type = type
          zipped.Date = date
          delete zipped.Name
          user_data_by_type[type].push(zipped)
          user_data_by_day[week][day] = zipped
        }
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

export async function dev(query, sheets) {
  const output = {}
  /*
   * grab year and user from url
   * hcanoe.vercel.app/18/ning-yiran
   *   {
   *     year: 18,
   *     user: ning-yiran
   *   }
   */
  const { year, user } = query

  /*
   * retrieve user's metadata (Name, Graduation Year)
   *   {
   *     Name,
   *     GradYear
   *   }
   */
  const metadata = await getMetadata(sheets, spreadsheet_ids.meta, 'data!A:F')

  const metadata_headers = metadata.shift()
  const metadata_body = searchUser(user, year, metadata)
  const user_metadata = zipTable(metadata_headers, metadata_body)
  const name = user_metadata.Name

  const spreadsheet_ids_by_type = getSpreadsheetsByType(user_metadata, 'run')

  const data_all_sheets = await getAllSheets(sheets, spreadsheet_ids_by_type)

  const [user_data_by_day, user_data_by_type] = getUserTrainingData(
    data_all_sheets,
    name
  )

  for (const type in user_data_by_type) {
    if (type === 'TIMED') {
      prettifyTimed(user_data_by_type[type])
    }
  }

  /*
   * returned values
   */
  if (user_metadata.DisplayName) {
    output.display_name = user_metadata.DisplayName
  } else {
    output.display_name = makeEnglish(user_metadata.Name)
  }
  output.timed = user_data_by_type.TIMED

  return output
}
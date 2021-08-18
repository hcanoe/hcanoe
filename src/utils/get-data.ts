import { searchUserInDay } from 'utils/user-meta'
import { zipTable } from 'utils/core'
import { getDate } from 'utils/date'
import sheetIDs from '@root/spreadsheets'
import { sheets, user_metadata, user_data_by_type } from 'types/types'

const getSpreadsheetsByType = (user_metadata: user_metadata, type: string) => {
  const start = user_metadata.GradYear - 5
  const active_years = [...Array(6)].map((_, index) => index + start)
  const result = []
  console.log('')
  console.log('== <START> ====================================')
  console.log('sheetIDs', sheetIDs)
  active_years.forEach((year) => {
    if (sheetIDs.hasOwnProperty(year) && sheetIDs[year].hasOwnProperty(type)) {
      result.push(sheetIDs[year][type])
    }
  })
  return result
}

async function getTrainingData(
  sheets: sheets,
  sheetID: string,
  sheetTitle: string
) {
  const range = sheetTitle.concat('!A:Z')
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetID,
    range,
  })
  return response
}


async function getAllSheets(sheets: sheets, idList: Array<string>) {
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

const getUserTrainingData = (data_all_sheets: any, name: string) => {
  const user_data_by_day = {}
  const user_data_by_type: user_data_by_type = {
    DISTANCE: [],
    INTERVALS: [],
    ONOFF: [],
    TIMED: [],
  }
  console.log('reading data from ->', Object.keys(data_all_sheets))
  for (const spreadsheet_id in data_all_sheets) {
    for (const week in data_all_sheets[spreadsheet_id]) {
      const data_week: Array<string> = data_all_sheets[spreadsheet_id][week]
      /*
       * data_week is an array of the week's trainings,
       * with each day separated by a single cell ['>>>']
       */
      const split_day = {}
      var arr = []
      data_week.forEach((e, index) => {
        // const training_id = week + day
        if (e[0] === '>>>') {
          // arr[1][0] is the day of week
          const training_id = arr[1][0] + index
          split_day[training_id] = arr
          arr = []
        } else if (index == data_week.length - 1) {
          arr.push(e)
          // arr[1][0] is the day of week
          const training_id = arr[1][0] + index
          split_day[training_id] = arr
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
        const dayOfWeek = split_day[day][1][0]
        const date = getDate(week, dayOfWeek)
        const day_arr = split_day[day]
        const headers = day_arr.shift()
        const type = headers.shift()
        const _body = searchUserInDay(name, day_arr)
        if (_body) {
          const body = _body.slice(1)
          interface zipped {
            Type?: string
            Date?: string
            Name?: string
          }
          const zipped: zipped = zipTable(headers, body)
          zipped.Type = type
          zipped.Date = date
          delete zipped.Name
          user_data_by_type[type].push(zipped)
          const training_id = week + day + type
          user_data_by_day[week][training_id] = zipped
        }
      }

      /*
       * at this point, user_data_by_day is an object,
       *  key = start of week in DD/MM/YYYY format
       *  props = date of training in DD/MM/YYYY
       */
    }
  }
  return { by_day: user_data_by_day, by_type: user_data_by_type }
}

export { getSpreadsheetsByType, getAllSheets, getUserTrainingData }

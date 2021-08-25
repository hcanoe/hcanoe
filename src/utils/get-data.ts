import { searchUserInDay } from 'utils/user-meta'
import { zipTable } from 'utils/core'
import { getDate } from 'utils/date'
import { sheets_v4 } from 'googleapis'
import {
  user_meta,
  user_data_by_type,
  SpreadsheetIds,
  TrainingType,
} from 'types/types'

export namespace data {
  /* reads one sheet and returns an excel array
   * (first element is an array of headers)
   */
  async function trainingData(
    sheets: sheets_v4.Sheets,
    spreadsheetId: string,
    sheetTitle: string,
    columns?: string
  ) {
    const _columns = columns || 'A:Z'
    const range = [sheetTitle, '!', _columns].join('')
    const response = (await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })).data.values
    return response
  }

  const getSpreadsheetsByType = (
    spreadsheet_ids: SpreadsheetIds,
    user_meta: user_meta,
    type: TrainingType
  ) => {
    const start = user_meta.GradYear - 5
    const active_years = [...Array(6)].map((_, index) => index + start)
    const result = []
    console.log('')
    console.log('== <START> ====================================')
    console.log(active_years)
    spreadsheet_ids.forEach((e, index) => {
      if (active_years.includes(parseInt(e.Year))) {
        result.push(spreadsheet_ids[index][type] || null)
      }
    })
    return result
  }

  export async function getDataByType(
    sheets: sheets_v4.Sheets,
    spreadsheet_ids: SpreadsheetIds,
    meta: user_meta,
    type: TrainingType
  ) {
    const idList = getSpreadsheetsByType(spreadsheet_ids, meta, type)
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
            result[id][title] = await trainingData(sheets, id, title)
          })
        )
      })
    )
    return result
  }

  export const getUserTrainingData = (data: any, name: string) => {
    const by_type: user_data_by_type = {
      DISTANCE: [],
      INTERVALS: [],
      ONOFF: [],
      TIMED: [],
    }
    console.log('reading data from ->', Object.keys(data))
    for (const id in data) {
      for (const week in data[id]) {
        const data_week: Array<string> = data[id][week]

        // data_week is an array of the week's trainings,
        // with each day separated by a single cell ['>>>']

        const split_day = getSplitDay(data_week)
        for (const day in split_day) {
          const trg = eachDay(name, day, week, split_day)
          trg && by_type[trg.Type].push(trg)
        }
      }
    }
    return { by_type }
  }

  function eachDay(name: string, day: string, week: string, split_day: any) {
    const dayOfWeek = split_day[day][1][0]
    const date = getDate(week, dayOfWeek)
    const day_arr = split_day[day]
    const headers = day_arr.shift()
    const type = headers.shift()
    const _body = searchUserInDay(name, day_arr)
    if (_body) {
      const body = _body.slice(1)
      const zipped: any = zipTable(headers, body)
      Object.assign(zipped, {
        Type: type,
        Date: date,
      })
      delete zipped.Name
      return zipped
    }
  }

  function getSplitDay(data_week: Array<string>) {
    const split_day = {}
    var arr = []
    data_week.forEach((e, index) => {
      // const training_id = week + day
      if (e[0] === '>>>') {
        // arr[1][0] is the day of week
        split_day[arr[1][0] + index] = arr
        arr = []
      } else {
        arr.push(e)
        index == data_week.length - 1 && (split_day[arr[1][0] + index] = arr)
      }
    })
    // key = day of week,
    // value = team's data for that day
    return split_day
  }
}

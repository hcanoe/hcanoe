import { zipTable } from '@/lib/core'
import { getDate } from '@/lib/date'
import { sheets_v4 } from 'googleapis'
import { SpreadsheetIds, TrainingType } from 'types/types'

const runTypes = ['DISTANCE', 'INTERVALS', 'ONOFF', 'TIMED']

export namespace data {
  /* reads one sheet and returns an excel array
   * (first element is an array of headers)
   */
  async function trainingData(
    sheets: sheets_v4.Sheets,
    spreadsheetId: string,
    sheetTitle: string,
    columns = ''
  ) {
    const _columns = columns.length > 0 ? '!' + columns : ''
    const range = [sheetTitle, _columns].join('')
    const response = (
      await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      })
    ).data.values
    return response
  }

  /* takes in metadata and training type,
   *
   * returns an array of strings,
   * listing the spreadsheet ids to read from
   */
  const idList = (
    spreadsheetIds: SpreadsheetIds,
    gradYear: number,
    type: TrainingType
  ) => {
    const start = gradYear - 5

    // an array of 6 numbers: years in which the paddler is active
    const activeYears = [...Array(6)].map((_, index) => index + start)

    console.log('')
    console.log('== <START> ====================================')
    console.log('active in', activeYears)

    const idList = []
    spreadsheetIds.forEach((e, index) => {
      if (activeYears.includes(parseInt(e.year))) {
        idList.push(spreadsheetIds[index][type] || null)
      }
    })
    return idList
  }

  /*
   * returns an object of objects of array of strings
   * containing the entire team's data
   * in years which the user is active
   * in the specific type that is queried
   *
   * data = {
   *   <spreadsheet id>: {
   *     <start of week>: [ team's data for the week ],
   *     ...
   *   },
   *   ...
   * }
   */
  export async function byType(
    sheets: sheets_v4.Sheets,
    spreadsheetIds: SpreadsheetIds,
    gradYear: number,
    type: TrainingType
  ) {
    const data = {}
    const l = idList(spreadsheetIds, gradYear, type)
    await Promise.all(
      l.map(async (id) => {
        data[id] = {}

        /* returns an array of strings, containing all sheet titles within that
         * spreadsheet
         *
         * note that these titles represent the date of the start of each
         * training week (all Mondays)
         */
        const sheetTitles = (
          await sheets.spreadsheets.get({ spreadsheetId: id })
        ).data.sheets.map((sheet) => sheet.properties.title)

        await Promise.all(
          sheetTitles.map(async (title) => {
            data[id][title] = await trainingData(sheets, id, title)
          })
        )
      })
    )
    return data
  }

  /* takes in the output of byType
   * returns an object containing only selected user's data,
   * sorted into Distance, Intervals, OnOff, and Timed categories
   */
  export const filterUser = (data: any, name: string) => {
    /* initialize a template object based on `runTypes` */
    const userData = runTypes.reduce(function (userData, type) {
      userData[type] = []
      return userData
    }, {})

    console.log('reading data from ->', Object.keys(data))

    for (const id in data) {
      for (const week in data[id]) {
        /* weekData is an array of the week's trainings,
         * with each day separated by a single cell ['>>>']
         */
        const weekData: Array<string> = data[id][week]
        splitDay(weekData, week, name).forEach((e) => {
          userData[e.type].push(e)
        })
      }
    }
    return userData
  }

  /* returns an array of objects,
   * containing training data specific to the user in a week
   */
  function splitDay(weekData: Array<string>, week: string, name: string) {
    const splitDay = []
    var arr = []
    weekData.forEach((e, index) => {
      if (e[0] === '>>>') {
        // arr[1][0] is the day of week
        arr.length > 1 && splitDay.push(eachDay(week, arr))
        arr = []
      } else {
        if (e.includes(name) || runTypes.includes(e[0])) {
          arr.push(e)
        }
        index == weekData.length - 1 &&
          arr.length > 1 &&
          splitDay.push(eachDay(week, arr))
      }
    })
    // key = day of week,
    // value = user's data for that day
    return splitDay
  }

  function eachDay(week: string, arr: Array<Array<string>>) {
    const type = arr[0].shift()
    const day = arr[1].shift()
    const zipped: any = zipTable(
      arr[0].map((e) => e.toLowerCase()),
      arr[1]
    )
    zipped.type = type
    zipped.date = getDate(week, day)
    delete zipped.name
    return zipped
  }
}

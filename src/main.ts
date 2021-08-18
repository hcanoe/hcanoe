import { getUserMetadata } from 'utils/user-meta'
import { getSpreadsheetsByType, getAllSheets, getUserTrainingData } from 'utils/get-data'
import { makeEnglish } from 'utils/text'
import {
  prettifyDistance,
  prettifyIntervals,
  prettifyOnOff,
  prettifyTimed,
} from 'utils/prettify-data'
import { sheets, query, user_metadata } from 'types/types'


export async function main(query: query, sheets: sheets) {
  const output: any = {}
  const { year, user } = query
  const user_metadata: user_metadata = await getUserMetadata(sheets, user, year)
  const name = user_metadata.Name

  const spreadsheet_ids_by_type = getSpreadsheetsByType(user_metadata, 'run')
  const data_all_sheets = await getAllSheets(sheets, spreadsheet_ids_by_type)

  output.log = ['data all sheets', data_all_sheets]

  const response = getUserTrainingData(data_all_sheets, name)
  // const user_data_by_day = response.by_day
  const user_data_by_type = response.by_type

  for (const type in user_data_by_type) {
    if (type === 'DISTANCE') {
      const response = prettifyDistance(user_data_by_type[type])
      output.best = response.best
      user_data_by_type[type] = response.arr
      output.cat = response.cat
    } else if (type === 'INTERVALS') {
      user_data_by_type[type] = prettifyIntervals(user_data_by_type[type])
    } else if (type === 'ONOFF') {
      user_data_by_type[type] = prettifyOnOff(user_data_by_type[type])
    } else if (type === 'TIMED') {
      user_data_by_type[type] = prettifyTimed(user_data_by_type[type])
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
  output.distance = user_data_by_type.DISTANCE
  output.intervals = user_data_by_type.INTERVALS
  output.on_off = user_data_by_type.ONOFF
  output.timed = user_data_by_type.TIMED

  return output
}

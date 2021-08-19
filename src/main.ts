import { niceCase } from 'utils/text'
import { getMetadata } from 'utils/user-meta'
import { sheets, query } from 'types/types'
import { getDataByType, getUserTrainingData } from 'utils/get-data'
import {
  prettifyDistance,
  prettifyIntervals,
  prettifyOnOff,
  prettifyTimed,
} from 'utils/prettify-data'

export async function main(query: query, sheets: sheets) {
  const output: any = {}
  const { year, user } = query
  const response_meta = await getMetadata(sheets, user, year)
  const meta = response_meta.user_meta
  const spreadsheet_ids = response_meta.spreadsheet_ids

  const data_run = await getDataByType(sheets, spreadsheet_ids, meta, 'Run')
  output.log = ['data all sheets', data_run]

  const response = getUserTrainingData(data_run, meta.Name)
  // const user_data_by_day = response.by_day
  const by_type = response.by_type

  for (const type in by_type) {
    switch (type) {
      case 'DISTANCE':
        const response = prettifyDistance(by_type[type])
        by_type[type] = response.arr
        output.best = response.best
        output.cat = response.cat
        break
      case 'INTERVALS':
        by_type[type] = prettifyIntervals(by_type[type])
        break
      case 'ONOFF':
        by_type[type] = prettifyOnOff(by_type[type])
        break
      case 'TIMED':
        by_type[type] = prettifyTimed(by_type[type])
        break
    }
  }

  Object.assign(output, {
    display_name: meta.DisplayName || niceCase(meta.Name),
    distance: by_type.DISTANCE,
    intervals: by_type.INTERVALS,
    on_off: by_type.ONOFF,
    timed: by_type.TIMED,
  })

  return output
}

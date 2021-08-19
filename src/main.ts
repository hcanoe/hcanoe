import { niceCase } from 'utils/text'
import { getMetadata } from 'utils/user-meta'
import { query } from 'types/types'
import { getDataByType, getUserTrainingData } from 'utils/get-data'
import { sheets_v4 } from 'googleapis'
import {
  prettifyDistance,
  prettifyIntervals,
  prettifyOnOff,
  prettifyTimed,
} from 'utils/prettify-data'

export async function main(query: query, sheets: sheets_v4.Sheets) {
  const output: any = {}
  const { year, user } = query
  const { meta, spreadsheet_ids } = await getMetadata(sheets, user, year)

  const data_run = await getDataByType(sheets, spreadsheet_ids, meta, 'Run')

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
        console.log(by_type[type], typeof by_type[type])
        by_type[type] = prettifyOnOff(by_type[type])
        break
      case 'TIMED':
        by_type[type] = prettifyTimed(by_type[type])
        break
    }
  }

  return {...output,
    display_name: meta.DisplayName || niceCase(meta.Name),
    distance: by_type.DISTANCE,
    intervals: by_type.INTERVALS,
    on_off: by_type.ONOFF,
    timed: by_type.TIMED,
  }
}

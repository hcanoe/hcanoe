import { text } from '@/lib/text'
import { userMeta } from '@/lib/user-meta'
import { query, user_data_by_type } from '@/lib/types'
import { data } from '@/lib/get-data'
import { sheets_v4 } from 'googleapis'
import {
  prettifyDistance,
  prettifyIntervals,
  prettifyOnOff,
  prettifyTimed,
} from '@/lib/prettify-data'

export async function main(query: query, sheets: sheets_v4.Sheets) {
  const output: any = {}
  const { year, user, trainingType } = query
  const { meta, spreadsheetIds } = await userMeta.data(sheets, user, year)
  const gradYear = parseInt(meta.GradYear)

  const data_run = await data.byType(sheets, spreadsheetIds, gradYear, 'run')

  // const user_data_by_day = response.by_day
  const by_type: user_data_by_type = data.filterUser(data_run, meta.Name)

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

  return {...output,
    display_name: meta.DisplayName || text.niceCase(meta.Name),
    distance: by_type.DISTANCE,
    intervals: by_type.INTERVALS,
    on_off: by_type.ONOFF,
    timed: by_type.TIMED,
  }
}
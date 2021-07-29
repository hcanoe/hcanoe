import moment from 'moment'
import { parseDistanceToSI } from '@utils/physics'

export const prettifyDistance = (obj) => {
  for (const date in obj) {
    const training = obj[date]
    /*
     * expected existing props:
     *  - Distance
     *  - Timing
     *  - Type
     *  - Date
     */
    const timing = moment.duration(training.Timing, 'HH:MM:SS')
  }
}

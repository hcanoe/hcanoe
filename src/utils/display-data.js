import moment from 'moment'
import {
  parseDistanceToSI,
  displayPace,
  displayDistance,
  displayDuration,
} from '@utils/physics'
import { recentFirst } from '@utils/sort'

export const prettifyDistance = (arr) => {
  arr.forEach((training, index, _arr) => {
    training.Pace = displayPace(training.Timing, training.Distance)
    training.Distance = displayDistance(training.Distance, 'km')
    training.Timing = displayDuration(training.Timing)
    const process_date = moment(training.Date, "DD/MM/YYYY").unix()
    training.SortDate = process_date
  })
  arr.sort(recentFirst)
  console.log(arr)
}

import moment from 'moment'
import {
  parseDistanceToSI,
  displayPace,
  displayDistance,
  displayDuration,
} from '@utils/physics'

export const prettifyDistance = (arr) => {
  arr.forEach((training, index, _arr) => {
    training.Pace = displayPace(training.Timing, training.Distance)
    training.Distance = displayDistance(training.Distance, 'km')
    training.Timing = displayDuration(training.Timing)
  })
}

import moment from 'moment'
import {
  parseDistanceToSI,
  displayPace,
  displayDistance,
  displayDuration,
} from '@utils/physics'
import { recentFirst } from '@utils/sort'

const prettifyDistance = (arr) => {
  arr.forEach((training) => {
    training.Pace = displayPace(training.Timing, training.Distance)
    training.Distance = displayDistance(training.Distance, 'km')
    training.Timing = displayDuration(training.Timing)
    const process_date = moment(training.Date, 'DD/MM/YYYY').unix()
    training.SortDate = process_date
  })
  arr.sort(recentFirst)
}

const prettifyIntervals = (arr) => {
  /*
   * expected input: an object
   *  - Set1: 800m
   *  - Set2: 800m
   *  - Set3: 800m
   *  - Rest1: 1:00
   *  - Rest2: 1:00
   *  - Rest3: 1:00
   *  - Timing1: 2:41
   *  - Timing2: 2:47
   *  - Timing3: 2:39
   *  - Date: 25/07/2021
   *
   *  TODO: sync up with Ryan on changing Rest to Interval
   *        Interval1 = Set 1 Run Time + Set 1 Rest Time
   *                  = Time from Set 1 start to Set 2 start
   *
   *  expected output:
   *    3 x 800m / 1'      2:41, 2:47, 2:39
   *
   * if further sets are added:
   *  - Set4: 400m
   *  - Set5: 400m
   *  - Set6: 400m
   *  - Rest4: 0:30
   *  - Rest5: 0:30
   *  - Rest6: 0:30
   *  - Timing4: 1:22
   *  - Timing5: 1:25
   *  - Timing6: 1:21
   *
   *  new expected output:
   *    3 x 800m / 1', 3 x 400m / 30"          2:41, 2:47, 2:39, 1:22, 1:25, 1:21
   */
  arr.forEach((training) => {
    const process_date = moment(training.Date, 'DD/MM/YYYY').unix()
    training.SortDate = process_date
  })
  arr.sort(recentFirst)
}

export { prettifyDistance, prettifyIntervals }

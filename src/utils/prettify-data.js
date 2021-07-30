import moment from 'moment'
import {
  parseDistanceToSI,
  displayPaceFromSI,
  displayPace,
  displayDistance,
  displayDuration,
} from '@utils/physics'
import { recentFirst } from '@utils/sort'

/*
 * Prettify Distance
 */
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

/*
 * Prettify Intervals
 */
const prettifyIntervals = (arr) => {
  const isKeyWord = {
    Set: 1,
    Rest: 1,
    Timing: 1,
  }
  arr.forEach((training) => {
    // training is an object
    const n = {}
    const by_sets = []
    for (const key in training) {
      const subtype = key.slice(0, -1)
      const order = key.slice(-1) - 1

      if (isKeyWord[subtype]) {
        if (typeof by_sets[order] === 'undefined') {
          by_sets[order] = {}
        }
        const target = subtype + 's'
        by_sets[order][subtype] = training[key]
      } else {
        // console.log(key, training[key])
      }
    }
    ;[training.Programme, training.Timings, training.Paces] =
      getIntervalsProgramme(by_sets)
    const process_date = moment(training.Date, 'DD/MM/YYYY').unix()
    training.SortDate = process_date

    // writes props from n into training
    // Object.assign(training, n)
  })
  arr.sort(recentFirst)
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
}

/*
 * takes in [H]:MM:SS
 * returns M'/S"
 */
const quoteNotation = (str) => {
  const p = {}
  const colonCount = str.match(/:/g).length
  if (colonCount === 1) {
    p.sec = moment.duration('0:' + str).asSeconds()
  } else if (colonCount === 2) {
    p.sec = moment.duration(str).asSeconds()
  }
  p.MM = parseInt(p.sec / 60)
  p.SS = parseInt(p.sec % 60)
  if (p.SS == 0) {
    p.result = p.MM + "'"
  } else {
    p.result = p.MM + "'" + p.SS + '"'
  }
  return p.result
}

const mmssNotation = (str) => {
  const p = {}
  const colonCount = str.match(/:/g).length
  if (colonCount === 1) {
    p.sec = moment.duration('0:' + str).asSeconds()
  } else if (colonCount === 2) {
    p.sec = moment.duration(str).asSeconds()
  }
  p.MM = parseInt(p.sec / 60)
  p.SS = parseInt(p.sec % 60)
  p.result = p.MM + ':' + p.SS
  return p.result
}

const rawToSecond = (str) => {
  const p = {}
  const colonCount = str.match(/:/g).length
  if (colonCount === 1) {
    p.sec = moment.duration('0:' + str).asSeconds()
  } else if (colonCount === 2) {
    p.sec = moment.duration(str).asSeconds()
  }
  return p.sec
}

const secondsToMMSS = (int) => {
  const p = {}
  p.sec = moment.duration(int, 'seconds').asSeconds()
  p.MM = parseInt(p.sec / 60)
  p.SS = parseInt(p.sec % 60)
  p.result = p.MM + ':' + p.SS
  return p.result
}

const getIntervalsProgramme = (d) => {
  /*
      console.log('--------------')
      console.log('enter set loop')
      console.log('--------------')
      */
  const p = [] // programme
  const r = [] // timing
  const s = [] // pace
  var c = 0
  var t = {
    // temp
    Set: '',
    Rest: '',
    Timings: [],
  }
  d.forEach((e, index) => {
    /*
     * if first, skip
     * if in between,
     *    if same distance and time,
     *        2x800m/1' -> 3x800m/1'
     *    if different distance and same time,
     *        2x800m/1' -> 2x800m/1', 1x400m/1'
     *    if same distance and different time,
     *        2x800m/1' -> 2x800m/1', 1x800m/2'
     *    if different distance and different time,
     *        2x800m/1' -> 2x800m/1', 1x200m/2'
     * handle last
     */
    const same = (type) => {
      if (d[index][type] === d[index - 1][type]) {
        return true
      }
      return false
    }

    if (index === 0) {
      // first element
      c += 1
      t.Set = e.Set
      t.Rest = e.Rest
      t.Timings.push(rawToSecond(e.Timing))
    } else if (index === d.length - 1) {
      // last element
      if (same('Set') && same('Rest')) {
        c += 1
        p.push(c + 'x' + t.Set + '/' + quoteNotation(t.Rest))
        t.Timings.push(rawToSecond(e.Timing))
        r.push(t.Timings.map((x) => secondsToMMSS(x)))
        // total time/total distance
        // = timings accumulated / (sets * number of sets)
        s.push(
          displayPaceFromSI(
            t.Timings.reduce((a, b) => a + b, 0),
            parseDistanceToSI(t.Set)
          )
        )
      } else {
        p.push(c + 'x' + t.Set + '/' + quoteNotation(t.Rest))
        p.push(1 + 'x' + e.Set + '/' + quoteNotation(e.Rest))
        r.push(t.Timings.map((x) => secondsToMMSS(x)))
        s.push(
          displayPaceFromSI(
            t.Timings.reduce((a, b) => a + b, 0),
            parseDistanceToSI(t.Set)
          )
        )
        r.push([secondsToMMSS(rawToSecond(e.Timing))])
        s.push(
          displayPaceFromSI(rawToSecond(e.Timing), parseDistanceToSI(e.Set))
        )
      }
    } else {
      // in between
      if (same('Set') && same('Rest')) {
        c += 1
        t.Timings.push(rawToSecond(e.Timing))
      } else {
        p.push(c + 'x' + t.Set + '/' + quoteNotation(t.Rest))
        r.push(t.Timings.map((x) => secondsToMMSS(x)))
        s.push(
          displayPaceFromSI(
            t.Timings.reduce((a, b) => a + b, 0),
            parseDistanceToSI(t.Set)
          )
        )
        t.Set = e.Set
        t.Rest = e.Rest
        t.Timings = []
        t.Timings.push(rawToSecond(e.Timing))
      }
    }
  })
  return [p, r, s]
}

export { prettifyDistance, prettifyIntervals }

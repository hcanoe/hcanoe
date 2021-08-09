import moment from 'moment'
import {
  parseDistanceToSI,
  parseDurationToSI,
  secondsPerMeterToHHMMSS,
  displayPace,
  displayDistance,
  stringToHHMMSS,
  secondsToHHMMSS,
} from '@utils/physics'
import { recentFirst } from '@utils/sort'

/*
 * Prettify Distance
 */
const prettifyDistance = (arr) => {
  const best = Array(4)
  const dict = {
    0: 1000,
    1: 2400,
    2: 5000,
    3: 10000,
  }
  const best_pace = Array(4)
  arr.forEach((training) => {
    // Pace
    training.Pace = displayPace(training.Timing, training.Distance)
    const si_pace = parseDurationToSI(training.Pace)
    // Distance
    const si_distance = parseDistanceToSI(training.Distance)
    training.Distance = displayDistance(training.Distance, 'km')
    // Timings
    const si_time = parseDurationToSI(training.Timing)
    training.Timing = stringToHHMMSS(training.Timing)
    // Check if best
    for (let i = 0; i < 4; i++) {
      if (si_distance >= dict[i]) {
        if (best_pace[i] === undefined) {
          best_pace[i] = {}
          best_pace[i].id = si_time + si_distance + training.Date
          best_pace[i].pace = si_pace
          training.best = []
        } else {
          if (si_pace < best_pace[i].pace) {
            best_pace[i].id = si_time + si_distance + training.Date
            best_pace[i].pace = si_pace
            training.best = []
          }
        }
      }
    }
    Object.assign(training, { si_pace, si_distance, si_time })
    const process_date = moment(training.Date, 'DD/MM/YYYY').unix()
    training.SortDate = process_date
  })
  arr.forEach((training) => {
    const this_id = training.si_time + training.si_distance + training.Date
    for (let i = 0; i < 4; i++) {
      if (best_pace[i] && this_id === best_pace[i].id) {
        training.best.push(dict[i])
        best[i] = training
      }
    }
  })
  arr.sort(recentFirst)
  return { best, arr }
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
    const by_sets = [] // each set being { Set: "", Rest: "", Distance: "" }
    for (const key in training) {
      const subtype = key.slice(0, -1)
      const order = key.slice(-1) - 1

      if (isKeyWord[subtype]) {
        if (typeof by_sets[order] === 'undefined') {
          by_sets[order] = {}
        }
        const target = subtype + 's'
        by_sets[order][subtype] = training[key]
      }
    }
    Object.assign(training, getIntervalsProgramme(by_sets))
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
  return arr
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

const mmssToSeconds = (str) => {
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

  const Programme = []
  const Timings = []
  const Paces = []
  var c = 0
  var mem = {
    Set: '',
    Rest: '',
    Timings: [],
  }
  d.forEach((e, index) => {
    const same = (type) => {
      if (d[index][type] === d[index - 1][type]) {
        return true
      }
      return false
    }

    if (index === 0) {
      // first element
      c += 1
      mem.Set = e.Set
      mem.Rest = e.Rest
      mem.Timings.push(mmssToSeconds(e.Timing))
    } else if (index === d.length - 1) {
      // last element
      if (same('Set') && same('Rest')) {
        c += 1
        mem.Timings.push(mmssToSeconds(e.Timing))
        Programme.push(c + 'x' + mem.Set + '/' + quoteNotation(mem.Rest))
        Timings.push(mem.Timings.map((x) => secondsToMMSS(x)))
        Paces.push(
          secondsPerMeterToHHMMSS(
            mem.Timings.reduce((a, b) => a + b, 0), // total timing in seconds
            parseDistanceToSI(mem.Set) * c // total distance in meters
          )
        )
      } else {
        Programme.push(c + 'x' + mem.Set + '/' + quoteNotation(mem.Rest))
        Timings.push(mem.Timings.map((x) => secondsToMMSS(x)))
        Paces.push(
          secondsPerMeterToHHMMSS(
            mem.Timings.reduce((a, b) => a + b, 0), // total timing in seconds
            parseDistanceToSI(mem.Set) * c // total distance in meters
          )
        )
        Programme.push(1 + 'x' + e.Set + '/' + quoteNotation(e.Rest))
        Timings.push([stringToHHMMSS(e.Timing)])
        Paces.push(
          secondsPerMeterToHHMMSS(mmssToSeconds(e.Timing), parseDistanceToSI(e.Set))
        )
      }
    } else {
      // in between
      if (same('Set') && same('Rest')) {
        c += 1
        mem.Timings.push(mmssToSeconds(e.Timing))
      } else {
        Programme.push(c + 'x' + mem.Set + '/' + quoteNotation(mem.Rest))
        Timings.push(mem.Timings.map((x) => secondsToMMSS(x)))
        Paces.push(
          secondsPerMeterToHHMMSS(
            mem.Timings.reduce((a, b) => a + b, 0), // total timing in seconds
            parseDistanceToSI(mem.Set) * c // total distance in meters
          )
        )
        mem.Set = e.Set
        mem.Rest = e.Rest
        mem.Timings = [] // reset Timings in memory
        mem.Timings.push(mmssToSeconds(e.Timing))
      }
    }
  })
  const output = {}
  output.Programme = Programme
  output.Timings = Timings.map((x) => x.join(', '))
  output.Paces = Paces
  return output
}

const getOnOffProgramme = (d) => {
  const Programme = []
  var c = 0
  var mem = {
    On: '',
    Off: '',
    Dash: [],
    Train: false,
  }
  d.forEach((e, index) => {
    e.On = quoteNotation(e.On)
    e.Off = quoteNotation(e.Off)
    /*
     * e contains an object with On and Off props
     */
    const sameOn = () => {
      return d[index].On === d[index - 1].On ? true : false
    }
    const sameOff = () => {
      return d[index].Off === d[index - 1].Off ? true : false
    }
    const dashEmpty = () => {
      return mem.Dash.length === 0 ? true : false
    }
    const pushSet = () => {
      if (c === 1) {
        Programme.push(mem.On + '/' + mem.Off)
      } else {
        Programme.push(c + 'x' + mem.On + '/' + mem.Off)
      }
    }
    /*
     * expected output:
     *   7x7'/1'
     *   3x7'/1', 3x3'/1'
     *   7'-6'-5'-4'-3'-2'-1'/1'
     */
    if (index === 0) {
      mem.Off = e.Off
      mem.On = e.On
      c += 1
    } else if (index === d.length - 1) {
      // last element
      if (sameOff()) {
        if (sameOn()) {
          c += 1
          Programme.push(c + 'x' + mem.On + '/' + mem.Off)
        } else if (!sameOn()) {
          if (mem.Train) {
            // dash train has started
            mem.Dash.push(e.On)
            Programme.push(mem.Dash.join('-') + '/' + mem.Off)
          } else if (c == 1) {
            // no dash train yet (same off, diff on)
            mem.Dash = [mem.On, e.On]
            Programme.push(mem.Dash.join('-') + '/' + mem.Off)
          } else {
            pushSet()
            Programme.push(e.On + '/' + e.Off)
          }
        }
      } else if (!sameOff()) {
        if (mem.Train) {
          // push dash train to Programme
          Programme.push(mem.Dash.join('-') + '/' + mem.Off)
        } else {
          pushSet()
        }
        mem.On = e.On
        mem.Off = e.Off
        Programme.push(mem.On + '/' + mem.Off)
      }
    } else {
      // in-between
      if (sameOff()) {
        if (sameOn()) {
          c += 1
        } else if (!sameOn()) {
          if (mem.Train) {
            // dash train has started
            mem.Dash.push(e.On)
          } else if (c == 1) {
            // no dash train yet (same off, diff on)
            // and set count is 1
            mem.Dash = [mem.On, e.On]
            mem.Train = true
          } else {
            pushSet()
            mem.On = e.On
            c = 1
          }
        }
      } else if (!sameOff()) {
        if (mem.Train) {
          // push dash train to Programme
          const temp_train = mem.Dash.join('-')
          Programme.push(temp_train + '/' + mem.Off)
        } else {
          pushSet()
        }
        mem.On = e.On
        mem.Off = e.Off
        mem.Train = false
        mem.Dash = []
      }
    }
  })
  const output = {}
  output.Programme = Programme.join(', ')
  return output
}

/*
 * Prettify Distance
 */
const prettifyOnOff = (arr) => {
  const isKeyWord = {
    On: 1,
    Off: 1,
  }
  arr.forEach((training) => {
    // training is an object
    const n = {}
    const by_sets = [] // each set being { On: "", Off: "" }
    for (const key in training) {
      const subtype = key.slice(0, -1) // string minus last char
      const order = key.slice(-1) - 1 // last char

      if (isKeyWord[subtype]) {
        if (typeof by_sets[order] === 'undefined') {
          by_sets[order] = {}
        }
        const target = subtype + 's'
        by_sets[order][subtype] = training[key]
      }
    }
    Object.assign(training, getOnOffProgramme(by_sets))
    training.Distance = displayDistance(training.Distance, 'km')
    const process_date = moment(training.Date, 'DD/MM/YYYY').unix()
    training.SortDate = process_date
  })
  arr.sort(recentFirst)
  return arr
}

/*
 * Prettify Timed
 */
const prettifyTimed = (arr) => {
  arr.forEach((training) => {
    training.Pace = displayPace(training.Duration, training.Distance)
    training.Distance = displayDistance(training.Distance, 'km')
    training.Programme = stringToHHMMSS(training.Duration)
    const process_date = moment(training.Date, 'DD/MM/YYYY').unix()
    training.SortDate = process_date
  })
  arr.sort(recentFirst)
  return arr
}

export { prettifyDistance, prettifyIntervals, prettifyOnOff, prettifyTimed }

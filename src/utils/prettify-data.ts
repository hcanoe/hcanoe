import moment from 'moment'
import {
  toMeters,
  toSeconds,
  displayPace,
  displayDistance,
  quoteNotation,
  toHHMMSS,
} from '@utils/physics'
import { recentFirst } from '@utils/sort'
import { Distance, Intervals, OnOff, Timed } from 'types/types'

/* Prettify Distance */
function prettifyDistance(arr: Distance) {
  const cat = [1000, 2400, 4000, 5000, 7000, 10000, 15000, 21000, 42195, 50000]
  const bestTemp = Array(cat.length)
  /* arr is an array with each element representing one training session */
  arr.forEach((training) => {
    /* Pace */
    training.Pace = displayPace(training.Timing, training.Distance)
    const siPace = toSeconds(training.Pace)

    /* Distance */
    const siDistance = toMeters(training.Distance)
    training.Distance = displayDistance(training.Distance, 'km')

    /* Timings */
    const siTime = toSeconds(training.Timing)
    training.Timing = toHHMMSS(training.Timing)

    /* Check if best
     * and write id and pace into bestTemp
     */
    cat.forEach((e, i) => {
      if (
        siDistance >= cat[i] &&
        (bestTemp[i] === undefined || siPace < bestTemp[i].pace)
      ) {
        training.best = []
        bestTemp[i] = {
          id: siTime + siDistance + e,
          pace: siPace,
        }
      }
    })
    Object.assign(training, { siPace, siDistance, siTime })
    training.SortDate = moment(training.Date, 'DD/MM/YYYY').unix()
  })
  /* bestTemp is now an array of objects containing the ids of the best runs and
   * their corresponding paces
   */
  const bestData = Array(cat.length)
  arr.forEach((training) => {
    /* tag each training with which distance it has best pace for
     * write that entire training into bestData, with the key being the distance
     */
    cat.forEach((e, i) => {
      const id = training.siTime + training.siDistance + e
      if (bestTemp[i] && id === bestTemp[i].id) {
        training.best.push(cat[i])
        bestData[i] = training
      }
    })
  })
  return { best: bestData, arr, cat }
}

/* Prettify Intervals */
type IntervalsBySets = Array<{
  Set?: string
  Rest?: string
  Timing?: string
}>
function prettifyIntervals(arr: Intervals) {
  const isKeyword = {
    Set: 1,
    Rest: 1,
    Timing: 1,
  }
  /* arr is an array with each element representing one training session */
  arr.forEach((training) => {
    const sets: IntervalsBySets = []
    for (const key in training) {
      /* Some headers are expected to have numbers, denoting
       * the set's order
       */
      const heading = key.replace(/[0-9]/g, '')
      if (isKeyword[heading]) {
        const order = parseInt(key.slice(-1)) - 1
        sets[order] === undefined && (sets[order] = {})
        sets[order][heading] = training[key]
      }
    }
    /* sets is now an array of objects,
     * each object containing the Set (Distance), Rest, and Timing values for
     * that set
     */
    Object.assign(training, intervalsProgramme(sets))
    training.SortDate = moment(training.Date, 'DD/MM/YYYY').unix()
  })
  arr.sort(recentFirst)
  return arr
}

/*
 * Reads an array of objects, each object representing one interval set
 *
 * returns three arrays of strings: Programme, Timings, Paces.
 * The length of these arrays will be the same.
 * The strings within these arrays have been formatted for reading.
 * intented to merge into an interval training as props
 */
function intervalsProgramme(d: IntervalsBySets) {
  const Programme = []
  const Timings = []
  const Paces = []
  var c = 0
  type Mem = {
    Set?: string // previous set's distance
    Rest?: string // previous set's rest time
    Timings?: Array<number> // previous sets' timings
  }
  var mem: Mem = {}
  function toPaces(timings: Array<number>, distance: string) {
    Paces.push(
      displayPace(
        timings.reduce((a, b) => a + b, 0), // total timing in seconds
        toMeters(distance) * c // total distance in meters
      )
    )
  }
  function toProgramme(c: number, distance: string, rest: string) {
    Programme.push(c + 'x' + distance + '/' + quoteNotation(rest))
  }
  d.forEach((e, index) => {
    function same(type: string) {
      return d[index][type] === d[index - 1][type] ? true : false
    }
    if (index === 0) {
      // first element
      c += 1
      mem = { ...mem, Set: e.Set, Rest: e.Rest }
      mem.Timings = [toSeconds(e.Timing)]
    } else if (index === d.length - 1) {
      // last element
      if (same('Set') && same('Rest')) {
        c += 1
        toProgramme(c, mem.Set, mem.Rest)
        mem.Timings.push(toSeconds(e.Timing))
        Timings.push(mem.Timings.map((x) => toHHMMSS(x)))
        toPaces(mem.Timings, mem.Set)
      } else {
        toProgramme(c, mem.Set, mem.Rest)
        Timings.push(mem.Timings.map((x) => toHHMMSS(x)))
        toPaces(mem.Timings, mem.Set)
        Programme.push(1 + 'x' + e.Set + '/' + quoteNotation(e.Rest))
        Timings.push([toHHMMSS(e.Timing)])
        Paces.push(displayPace(toSeconds(e.Timing), toMeters(e.Set)))
      }
    } else {
      // neither first nor last element
      if (same('Set') && same('Rest')) {
        c += 1
        mem.Timings.push(toSeconds(e.Timing))
      } else {
        toProgramme(c, mem.Set, mem.Rest)
        Timings.push(mem.Timings.map((x) => toHHMMSS(x)))
        toPaces(mem.Timings, mem.Set)
        mem = { ...mem, Set: e.Set, Rest: e.Rest }
        mem.Timings = [toSeconds(e.Timing)] // reset Timings in memory
      }
    }
  })
  return {
    Programme,
    Timings: Timings.map((x) => x.join(', ')),
    Paces,
  }
}

type OnOffBySets = Array<{
  On?: string
  Off?: string
}>
const getOnOffProgramme = (d: OnOffBySets) => {
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
          const tempTrain = mem.Dash.join('-')
          Programme.push(tempTrain + '/' + mem.Off)
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
  const output: any = {}
  output.Programme = Programme.join(', ')
  return output
}

/* Prettify OnOff */
const prettifyOnOff = (arr: OnOff) => {
  const isKeyWord = {
    On: 1,
    Off: 1,
  }
  arr.forEach((training) => {
    // training is an object
    const bySets = [] // each set being { On: "", Off: "" }
    for (const key in training) {
      const subtype: any = key.slice(0, -1) // string minus last char
      const order: any = parseInt(key.slice(-1)) - 1 // last char

      if (isKeyWord[subtype]) {
        if (typeof bySets[order] === 'undefined') {
          bySets[order] = {}
        }
        bySets[order][subtype] = training[key]
      }
    }
    Object.assign(training, getOnOffProgramme(bySets))
    training.Distance = displayDistance(training.Distance, 'km')
    const processDate = moment(training.Date, 'DD/MM/YYYY').unix()
    training.SortDate = processDate
  })
  arr.sort(recentFirst)
  return arr
}

/* Prettify Timed */
const prettifyTimed = (arr: Timed) => {
  arr.forEach((training) => {
    training.Duration =
      training.Duration === undefined ? training.Timing : training.Duration
    training.Pace = displayPace(training.Duration, training.Distance)
    training.Distance = displayDistance(training.Distance, 'km')
    training.Programme = toHHMMSS(training.Duration)
    const processDate = moment(training.Date, 'DD/MM/YYYY').unix()
    training.SortDate = processDate
  })
  arr.sort(recentFirst)
  return arr
}

export { prettifyDistance, prettifyIntervals, prettifyOnOff, prettifyTimed }

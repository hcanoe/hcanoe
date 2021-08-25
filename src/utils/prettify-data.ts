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

namespace sets {
  export type Intervals = Array<{
    set?: string
    rest?: string
    timing?: string
  }>
  export type OnOff = Array<{
    off?: string
    on?: string
  }>
}

namespace programme {
  /*
   * Reads an array of objects, each object representing one interval set
   *
   * returns three arrays of strings: Programme, Timings, Paces.
   * The length of these arrays will be the same.
   * The strings within these arrays have been formatted for reading.
   * intented to merge into an interval training as props
   */
  export function intervals(d: sets.Intervals) {
    const programme = []
    const timings = []
    const paces = []
    var c = 0
    type Mem = {
      set?: string // previous set's distance
      rest?: string // previous set's rest time
      timings?: Array<number> // previous sets' timings
    }
    var mem: Mem = {}
    function toPaces(timings: Array<number>, distance: string) {
      paces.push(
        displayPace(
          timings.reduce((a, b) => a + b, 0), // total timing in seconds
          toMeters(distance) * c // total distance in meters
        )
      )
    }
    function toProgramme(c: number, distance: string, rest: string) {
      programme.push(c + 'x' + distance + '/' + quoteNotation(rest))
    }
    d.forEach((e, index) => {
      function same(type: string) {
        return d[index][type] === d[index - 1][type] ? true : false
      }
      if (index === 0) {
        // first element
        c += 1
        mem = { ...mem, set: e.set, rest: e.rest }
        mem.timings = [toSeconds(e.timing)]
      } else if (index === d.length - 1) {
        // last element
        if (same('set') && same('rest')) {
          c += 1
          toProgramme(c, mem.set, mem.rest)
          mem.timings.push(toSeconds(e.timing))
          timings.push(mem.timings.map((x) => toHHMMSS(x)))
          toPaces(mem.timings, mem.set)
        } else {
          toProgramme(c, mem.set, mem.rest)
          timings.push(mem.timings.map((x) => toHHMMSS(x)))
          toPaces(mem.timings, mem.set)
          programme.push(1 + 'x' + e.set + '/' + quoteNotation(e.rest))
          timings.push([toHHMMSS(e.timing)])
          paces.push(displayPace(toSeconds(e.timing), toMeters(e.set)))
        }
      } else {
        // neither first nor last element
        if (same('set') && same('rest')) {
          c += 1
          mem.timings.push(toSeconds(e.timing))
        } else {
          toProgramme(c, mem.set, mem.rest)
          timings.push(mem.timings.map((x) => toHHMMSS(x)))
          toPaces(mem.timings, mem.set)
          mem = { ...mem, set: e.set, rest: e.rest }
          mem.timings = [toSeconds(e.timing)] // reset Timings in memory
        }
      }
    })
    return {
      programme,
      timings: timings.map((x) => x.join(', ')),
      paces,
    }
  }
  export function onOff(d: sets.OnOff) {
    const programme = []
    var c = 0
    var mem = {
      on: '',
      off: '',
      dash: [],
      streak: false,
    }
    d.forEach((e, index) => {
      e.on = quoteNotation(e.on)
      e.off = quoteNotation(e.off)
      /*
       * e contains an object with on and off props
       */
      const sameOn = () => {
        return d[index].on === d[index - 1].on ? true : false
      }
      const sameOff = () => {
        return d[index].off === d[index - 1].off ? true : false
      }
      const pushSet = () => {
        if (c === 1) {
          programme.push(mem.on + '/' + mem.off)
        } else {
          programme.push(c + 'x' + mem.on + '/' + mem.off)
        }
      }
      /*
       * expected output:
       *   7x7'/1'
       *   3x7'/1', 3x3'/1'
       *   7'-6'-5'-4'-3'-2'-1'/1'
       */
      if (index === 0) {
        mem.off = e.off
        mem.on = e.on
        c += 1
      } else if (index === d.length - 1) {
        // last element
        if (sameOff()) {
          if (sameOn()) {
            c += 1
            programme.push(c + 'x' + mem.on + '/' + mem.off)
          } else if (!sameOn()) {
            if (mem.streak) {
              // dash train has started
              mem.dash.push(e.on)
              programme.push(mem.dash.join('-') + '/' + mem.off)
            } else if (c == 1) {
              // no dash train yet (same off, diff on)
              mem.dash = [mem.on, e.on]
              programme.push(mem.dash.join('-') + '/' + mem.off)
            } else {
              pushSet()
              programme.push(e.on + '/' + e.off)
            }
          }
        } else if (!sameOff()) {
          if (mem.streak) {
            // push dash train to programme
            programme.push(mem.dash.join('-') + '/' + mem.off)
          } else {
            pushSet()
          }
          mem.on = e.on
          mem.off = e.off
          programme.push(mem.on + '/' + mem.off)
        }
      } else {
        // in-between
        if (sameOff()) {
          if (sameOn()) {
            c += 1
          } else if (!sameOn()) {
            if (mem.streak) {
              // dash train has started
              mem.dash.push(e.on)
            } else if (c == 1) {
              // no dash train yet (same off, diff on)
              // and set count is 1
              mem.dash = [mem.on, e.on]
              mem.streak = true
            } else {
              pushSet()
              mem.on = e.on
              c = 1
            }
          }
        } else if (!sameOff()) {
          if (mem.streak) {
            // push dash train to programme
            const tempStreak = mem.dash.join('-')
            programme.push(tempStreak + '/' + mem.off)
          } else {
            pushSet()
          }
          mem.on = e.on
          mem.off = e.off
          mem.streak = false
          mem.dash = []
        }
      }
    })
    const output: any = {}
    output.programme = programme.join(', ')
    return output
  }
}

/* Prettify Distance */
function prettifyDistance(arr: Distance) {
  const cat = [1000, 2400, 4000, 5000, 7000, 10000, 15000, 21000, 42195, 50000]
  const bestTemp = Array(cat.length)
  /* arr is an array with each element representing one training session */
  arr.forEach((training) => {
    /* Pace */
    training.pace = displayPace(training.timing, training.distance)
    const siPace = toSeconds(training.pace)

    /* Distance */
    const siDistance = toMeters(training.distance)
    training.distance = displayDistance(training.distance, 'km')

    /* Timings */
    const siTime = toSeconds(training.timing)
    training.timing = toHHMMSS(training.timing)

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
    training.sortDate = moment(training.date, 'DD/MM/YYYY').unix()
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
function prettifyIntervals(arr: Intervals) {
  const isKeyword = {
    set: 1,
    rest: 1,
    timing: 1,
  }
  /* arr is an array with each element representing one training session */
  arr.forEach((training) => {
    const sets: sets.Intervals = []
    for (const key in training) {
      /* Some headers are expected to have numbers, denoting
       * the set's order
       */
      const heading = key.replace(/[0-9]/g, '').toLowerCase()
      if (isKeyword[heading]) {
        const order = parseInt(key.replace(/\D/g, '')) - 1
        sets[order] === undefined && (sets[order] = {})
        sets[order][heading] = training[key]
      }
    }
    /* sets is now an array of objects,
     * each object containing the set (distance), rest, and timing values for
     * that set
     */
    Object.assign(training, programme.intervals(sets))
    training.sortDate = moment(training.Date, 'DD/MM/YYYY').unix()
  })
  arr.sort(recentFirst)
  return arr
}

/* Prettify OnOff */
const prettifyOnOff = (arr: OnOff) => {
  const isKeyword = {
    on: 1,
    off: 1,
  }
  arr.forEach((training) => {
    // training is an object
    const sets: sets.OnOff = [] // each set being { on: "", off: "" }
    for (const key in training) {
      /* Some headers are expected to have numbers, denoting
       * the set's order
       */
      const heading = key.replace(/[0-9]/g, '').toLowerCase()
      if (isKeyword[heading]) {
        const order = parseInt(key.replace(/\D/g, '')) - 1
        sets[order] === undefined && (sets[order] = {})
        sets[order][heading] = training[key]
      }
    }
    /* sets is now an array of objects,
     * each object containing the on and off values for each set
     */
    Object.assign(training, programme.onOff(sets))
    training.distance = displayDistance(training.distance, 'km')
    training.sortDate = moment(training.date, 'DD/MM/YYYY').unix()
  })
  arr.sort(recentFirst)
  return arr
}

/* Prettify Timed */
const prettifyTimed = (arr: Timed) => {
  arr.forEach((training) => {
    training.duration =
      training.duration === undefined ? training.timing : training.duration
    training.pace = displayPace(training.duration, training.distance)
    training.distance = displayDistance(training.distance, 'km')
    training.programme = toHHMMSS(training.duration)
    const processDate = moment(training.date, 'DD/MM/YYYY').unix()
    training.sortDate = processDate
  })
  arr.sort(recentFirst)
  return arr
}

export { prettifyDistance, prettifyIntervals, prettifyOnOff, prettifyTimed }

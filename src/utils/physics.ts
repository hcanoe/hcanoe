import moment from 'moment'

/*
 * parses a human readable distance to distance in meters
 * values without units are assumed to be in km
 * values above 100 are assumed to be in m
 * (here's to the one crazy guy that makes me come back here to fix this assumption)
 *
 * 8.0km => 8000
 * 800m  => 800
 * 8     => 8000
 * 800   => 800
 *
 */
const parseDistanceToSI = (s: string) => {
  if (s.includes('k')) {
    const num = parseFloat(s.replace('km', '').replace(/ /g, ''))
    return num * 1000
  } else if (s.includes('m')) {
    const num = parseFloat(s.replace('m', '').replace(/ /g, ''))
    return num
  } else {
    const num = parseFloat(s.replace(/ /g, ''))
    // values above 99 are assumed to be in m
    if (num >= 100) {
      return num
    } else {
      return num * 1000
    }
  }
}

const parseDurationToSI = (t: string) => {
  const colonCount = t.match(/:/g).length
  if (colonCount === 1) {
    return moment.duration('0:' + t).asSeconds()
  } else if (colonCount === 2) {
    return moment.duration(t).asSeconds()
  }
}

const displayDistance = (s: string, unit: string) => {
  const d: number = parseDistanceToSI(s)
  if (unit === 'km') {
    return (d / 1000).toFixed(2) + ' km'
  } else if (unit === 'm') {
    return d.toFixed(0) + ' m'
  } else {
    return 'invalid unit'
  }
}

/*
 * takes in
 *  1. human readable timing ([H]:MM:SS) and
 *  2. distance (using parseDistanceToSI())
 * returns min/km, human readable again
 */
const displayPace = (t: string, d: string) => {
  return displayPaceFromSI(parseDurationToSI(t), parseDistanceToSI(d))
}

/*
 * takes in all SI units (seconds, meters)
 * returns min/km, human readable again
 */
const displayPaceFromSI = (t: number, d: number) => {
  return secondsToHHMMSS((t / d) * 1000)
}

const displayDuration = (t: string) => {
  const colonCount = t.match(/:/g).length
  if (colonCount === 1) {
    return moment.duration('0:' + t).asSeconds()
  } else if (colonCount === 2) {
    return moment.duration(t).asSeconds()
  }
}

const secondsToHHMMSS = (t: number) => {
  const H = new Date(t * 1000).toISOString().substr(11, 2)
  const M = new Date(t * 1000).toISOString().substr(14, 2)
  const S = new Date(t * 1000).toISOString().substr(17, 2)
  if (H === '00') {
    if (M === '00') {
      return ['0', S].join(':')
    } else if (M[0] === '0') {
      return [M[1], S].join(':')
    } else {
      return [M, S].join(':')
    }
  } else if (H[0] === '0') {
    return [H[1], M, S].join(':')
  } else {
    return [H, M, S].join(':')
  }
}

export {
  displayDuration,
  displayDistance,
  displayPace,
  displayPaceFromSI,
  parseDistanceToSI,
  parseDurationToSI,
  secondsToHHMMSS,
}

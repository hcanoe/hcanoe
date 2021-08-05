import moment from 'moment'

/*
 * parses a human readable distance to distance in meters
 * values without units are assumed to be in km
 * values above 99 are assumed to be in m
 * (here's to the one crazy guy that makes me come back here to fix this assumption)
 *
 * 8.0km => 8000
 * 800m  => 800
 * 8     => 8000
 * 800   => 800
 *
 */
const parseDistanceToSI = (string) => {
  if (string.includes('k')) {
    const num = parseFloat(string.replace('km', '').replace(/ /g, ''))
    return num * 1000
  } else if (string.includes('m')) {
    const num = parseFloat(string.replace('m', '').replace(/ /g, ''))
    return num
  } else {
    const num = parseFloat(string.replace(/ /g, ''))
    if (num >= 100) {
      return num
    } else {
      return num * 1000
    }
  }
  return 'distance'
}

const parseDurationToSI = (dur) => {
  const p = {}
  const colonCount = dur.match(/:/g).length
  if (colonCount === 1) {
    p.sec = moment.duration('0:' + dur).asSeconds()
  } else if (colonCount === 2) {
    p.sec = moment.duration(dur).asSeconds()
  }
  return p.sec
}

const displayDistance = (string, unit) => {
  console.log('displayDistance ->', string)
  const d = parseDistanceToSI(string)
  if (unit === 'km') {
    return (d / 1000).toFixed(2) + ' km'
  } else if (unit === 'm') {
    return d + ' m'
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
const displayPace = (dur, dist) => {
  const p = {}
  p.sec = parseDurationToSI(dur)
  p.m = parseDistanceToSI(dist)
  return displayPaceFromSI(p.sec, p.m)
}

/*
 * takes in all SI units (seconds, meters)
 * returns min/km, human readable again
 */
const displayPaceFromSI = (dur, dist) => {
  return durationSItoDisplay(dur / dist * 1000)
}

const displayDuration = (dur) => {
  const p = {}
  const colonCount = dur.match(/:/g).length
  if (colonCount === 1) {
    p.sec = moment.duration('0:' + dur).asSeconds()
  } else if (colonCount === 2) {
    p.sec = moment.duration(dur).asSeconds()
  }
  return durationSItoDisplay(p.sec)
}

const durationSItoDisplay = (sec) => {
  const H = new Date(sec * 1000).toISOString().substr(11, 2)
  const M = new Date(sec * 1000).toISOString().substr(14, 2)
  const S = new Date(sec * 1000).toISOString().substr(17, 2)
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
  durationSItoDisplay,
}

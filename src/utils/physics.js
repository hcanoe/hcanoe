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

const displayDistance = (string, unit) => {
  const d = parseDistanceToSI(string)
  if (unit === 'km') {
    return (d / 1000).toFixed(0) + ' km'
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
  const colonCount = dur.match(/:/g).length
  if (colonCount === 1) {
    p.sec = moment.duration('0:' + dur).asSeconds()
  } else if (colonCount === 2) {
    p.sec = moment.duration(dur).asSeconds()
  }
  p.m = parseDistanceToSI(dist)
  p.min_per_km = (p.sec / 60 / p.m) * 1000
  p.MM = parseInt(p.min_per_km)
  p.SS = parseInt((p.min_per_km % 1) * 60)
  p.result = p.MM + ':' + p.SS
  return p.result
}

const displayDuration = (dur) => {
  const colonCount = dur.match(/:/g).length
  if (colonCount === 1) {
    return dur
  } else if (colonCount === 2) {
    const h = parseInt(dur.split(':')[0])
    if (h == 0) {
      return dur.split(':').slice(1).join(':')
    } else {
      return dur
    }
  }
}

export { displayDuration, displayDistance, displayPace, parseDistanceToSI }

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
const toMeters = (s: string) => {
  if (s.includes('k')) {
    const num = parseFloat(s.replace('km', '').replace(/ /g, ''))
    return num * 1000
  } else if (s.includes('m')) {
    const num = parseFloat(s.replace('m', '').replace(/ /g, ''))
    return num
  } else {
    const num = parseFloat(s.replace(/ /g, ''))
    // values above 99 are assumed to be in m
    return num >= 100 ? num : num * 1000
  }
}

const toSeconds = (t: string) => {
  const colonCount = t.match(/:/g).length
  if (colonCount === 1) {
    return moment.duration('0:' + t).asSeconds()
  } else if (colonCount === 2) {
    return moment.duration(t).asSeconds()
  }
}

const displayDistance = (s: string | number, unit: string, p?: number) => {
  const P = typeof p === 'undefined' ? 2 : p
  const d: number = typeof s === 'number' ? s : toMeters(s)
  if (unit === 'km') {
    return (d / 1000).toFixed(P) + ' km'
  } else if (unit === 'm') {
    return d.toFixed(0) + ' m'
  } else {
    return 'invalid unit'
  }
}

/*
 * takes in
 *  1. human readable timing ([H]:MM:SS) and
 *  2. distance (using toMeters())
 * returns min/km, human readable again
 */
const displayPace = (t: string | number, d: string | number) => {
  const T: number = typeof t === 'number' ? t : toSeconds(t)
  const D: number = typeof d === 'number' ? d : toMeters(d)
  return toHHMMSS(T / D * 1000)
}

/*
 * takes in # of seconds
 * returns [HH]:MM:SS
 */
const toHHMMSS = (t: string | number) => {
  const T: number = typeof t === 'number' ? t : toSeconds(t)
  const H = new Date(T * 1000).toISOString().substr(11, 2)
  const M = new Date(T * 1000).toISOString().substr(14, 2)
  const S = new Date(T * 1000).toISOString().substr(17, 2)
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
  displayDistance,
  displayPace,
  toMeters,
  toSeconds,
  toHHMMSS
}

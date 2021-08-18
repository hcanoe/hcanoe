/*
 * takes in "ning-yiran"
 * returns "Ning Yiran"
 */
const niceCase = (str: string) => {
  const parts = str.replace(/ /g, '-').toLowerCase().split('-')
  const res = parts
    .map(
      (word) =>
        // capitalizes first letter
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
  return res
}

const upperCase = (str: string) => {
  const result = str.replace(/-/g, ' ').toUpperCase()
  return result
}

const medalDist = (num: number) => {
  const str = (num / 1000).toFixed(1).toString()
  if (str.slice(-1) === '0') {
    return str.split('.')[0]
  } else {
    return str
  }
}

export { niceCase, upperCase, medalDist }

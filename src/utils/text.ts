/*
 * takes in "ning-yiran"
 * returns "Ning Yiran"
 */
const makeEnglish = (str: string) => {
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

/*
 * takes in "kevin-chang"
 * returns "KEVIN CHANG"
 */
const makeNameCaps = (str: string) => {
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

export { makeEnglish, makeNameCaps, medalDist }

/*
 * takes in "ning-yiran"
 * returns "Ning Yiran"
 */
const makeEnglish = (str) => {
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

const allCaps = (str) => {
  const result = str.replace(/-/g, ' ').toUpperCase()
  return result
}

const makeNameCaps = (str) => {
  const result = str.replace(/-/g, ' ').toUpperCase()
  return result
}

export { makeEnglish, allCaps, makeNameCaps }

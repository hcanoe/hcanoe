/*
 * takes in "ning-yiran"
 * returns "Ning Yiran"
 */
export const makeEnglish = (str) => {
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

export const allCaps = (str) => {
  const result = str.replace(/-/g, ' ').toUpperCase()
  return result
}

export const makeNameCaps = (str) => {
  const result = str.replace(/-/g, ' ').toUpperCase()
  return result
}

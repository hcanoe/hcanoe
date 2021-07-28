/*
 * takes in "ning-yiran"
 * returns "Ning Yiran"
 */
export const makeEnglish = (str) => {
  const parts = str.split('-')
  const res = parts
    .map(
      (word) =>
        // capitalizes first letter
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(' ')
  return res
}

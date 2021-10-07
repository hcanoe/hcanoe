namespace text {
  /*
   * takes in "ning-yiran"
   * returns "Ning Yiran"
   */
  export const niceCase = (str: string) => {
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
   * takes in "kevin-chang" or "kevin chang"
   * returns "KEVIN CHANG"
   */
  export const upperCase = (str: string) => {
    const result = str.replace(/-/g, ' ').toUpperCase()
    return result
  }

  /*
   * if input is 1000, return '1'
   * if input is 2400, return '2.4'
   * if input is 42195, return '42.2'
   */
  export const medalDist = (num: number) => {
    const str = (num / 1000).toFixed(1).toString()
    if (str.slice(-1) === '0') {
      return str.split('.')[0]
    } else {
      return str
    }
  }
}

export { text }

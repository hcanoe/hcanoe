/* usage:
 * import { sorter } from '@utils/sorter'
 * arr.sort(sorter.date)
 */
namespace sorter {
  /*
   * sorts an array of objects by each object's date prop
   */
  export const date = (a: any, b: any) => {
    if (a.sortDate > b.sortDate) {
      return -1
    }
    if (a.sortDate < b.sortDate) {
      return 1
    }
    return 0
  }

  /*
   * sorts an array of objects by each object's siPace prop
   */
  export const pace = (a: any, b: any) => {
    if (a.siPace > b.siPace) {
      return 1
    }
    if (a.siPace < b.siPace) {
      return -1
    }
    return 0
  }
}

export { sorter }

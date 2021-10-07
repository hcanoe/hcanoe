/* converts an excel array to an array of objects.
 *
 * takes in an excel array:
 * arr = [
 *   ['Name', 'Age', 'Height'],
 *   ['John', 18   , 160],
 *   ['Mary', 19   , 165]
 * ]
 *
 * and returns an array of objects:
 * result = [
 *   {
 *     Name: 'John',
 *     Age: 18,
 *     Height: 160
 *   },
 *   {
 *     Name: 'Mary',
 *     Age: 19,
 *     Height: 165
 *   }
 * ]
 */
function toObject(arr: Array<Array<any>>) {
  const headers = arr.shift()
  const result = arr.map((e) =>
    headers.reduce(
      (obj, key, index) => ({
        ...obj,
        [key]: e[index],
      }),
      {}
    )
  )
  return result
}

/* takes in two one-dimensional arrays:
 * keys = ['a', 'b', 'c']
 * data = [1, 2, 'three']
 *
 * and returns an object:
 * result = {
 *   a: 1,
 *   b: 2,
 *   c: 'three'
 * }
 */
function zipTable(keys: Array<string>, data: Array<string>) {
  const result = keys.reduce(
    (obj, k, i) => ({
      ...obj,
      [k]: data[i],
    }),
    {}
  )
  return result
}

export { zipTable, toObject }

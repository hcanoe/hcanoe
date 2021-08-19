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

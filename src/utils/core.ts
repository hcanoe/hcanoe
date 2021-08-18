const zipTable = (keys: Array<string>, data: Array<string>) => {
  const result = keys.reduce(
    (obj, k, i) => ({
      ...obj,
      [k]: data[i],
    }),
    {}
  )
  return result
}

export { zipTable }

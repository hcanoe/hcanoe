import sheetIDs from '@root/sheets'

export const searchUser = (search_str, tableData) => {
  const searchRes = tableData.filter((arr) => {
    if (arr.includes(search_str)) {
      return true
    } else {
      return false
    }
  })
  return searchRes
}

export const generateUserObject = (searchRes, keys) => {
  var userData = []
  const l = searchRes.length
  if (l == 1) {
    userData = searchRes[0]
  } else if (l > 1) {
    console.log('more than one user matches search')
    return { error: 'more than one user matches search' }
  } else {
    console.log('no user matches search')
    return { error: 'no user matches search' }
  }
  const result = keys.reduce(
    (obj, k, i) => ({
      ...obj,
      [k]: userData[i],
    }),
    {}
  )
  return result
}

export const expandActiveYears = (userObject) => {
  const start = userObject.GradYear - 5
  const years = []
  for (let i = 0; i < 6; i++) {
    years.push(start + i)
  }
  return years
}

export const getActiveSheets = (activeYears) => {
  const activeSheets = {}
  activeYears.forEach((y) => {
    if (sheetIDs.hasOwnProperty(y)) {
      activeSheets[y] = (sheetIDs[y])
    }
  })
  return activeSheets
}

import sheetIDs from '@root/spreadsheets'

export const searchUser = (User, gradYY, tableData) => {
  const gradYear = "20" + gradYY
  const searchRes = tableData.filter((arr) => {
    if (arr.includes(User) && arr.includes(gradYear)) {
      return true
    } else {
      return false
    }
  })
  const l = searchRes.length
  var userData
  if (l == 1) {
    userData = searchRes[0]
  } else if (l > 1) {
    console.log('more than one user matches search')
    return { error: 'more than one user matches search' }
  } else {
    console.log('no user matches search')
    return { error: 'no user matches search' }
  }
  return userData
}

export const zipTable = (keys, data) => {
  const result = keys.reduce(
    (obj, k, i) => ({
      ...obj,
      [k]: data[i],
    }),
    {}
  )
  return result
}

export const getActiveYears = (userObject) => {
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
      activeSheets[y] = sheetIDs[y]
    }
  })
  return activeSheets
}

export const getSpreadsheetsByType = (activeSheets, type) => {
  const result = []
  for (const year in activeSheets) {
    if (activeSheets[year].hasOwnProperty(type)) {
      result.push(activeSheets[year][type])
    }
  }
  return result
}

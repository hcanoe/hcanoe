import sheetIDs from '@root/spreadsheets'
import { makeEnglish, makeNameCaps } from '@utils/text'
import spreadsheet_ids from '@root/spreadsheets'

export async function getUserMetadata({ sheets, user, year }) {
  const response = (
    await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheet_ids.meta,
      range: `data!A:F`,
    })
  ).data.values
  if (response) {
    const headers = response.shift()
    const body = searchUser(user, year, response)
    const user_metadata = zipTable(headers, body)
    return user_metadata
  } else {
    console.log('no response from google sheets')
  }
}

const searchUser = (user, year, data) => {
  const full_year = '20' + year
  const search_res = data.filter((arr) => {
    if (
      (arr.includes(user) || arr.includes(makeNameCaps(user))) &&
      arr.includes(full_year)
    ) {
      return true
    } else {
      return false
    }
  })
  const l = search_res.length
  if (l == 1) {
    return search_res[0]
  } else if (l > 1) {
    console.log('more than one user matches search')
    return { error: 'more than one user matches search' }
  } else {
    console.log('no user matches search')
    return { error: 'no user matches search' }
  }
}

const searchUserInDay = (User, tableData) => {
  const search_res = tableData.filter((arr) => {
    if (arr.includes(User)) {
      return true
    } else {
      return false
    }
  })
  return search_res[0]
}

const zipTable = (keys, data) => {
  const result = keys.reduce(
    (obj, k, i) => ({
      ...obj,
      [k]: data[i],
    }),
    {}
  )
  return result
}

const getActiveYears = (userObject) => {
  const start = userObject.GradYear - 5
  const years = []
  for (let i = 0; i < 6; i++) {
    years.push(start + i)
  }
  return years
}

const getActiveSpreadsheets = (activeYears) => {
  const activeSheets = {}
  activeYears.forEach((y) => {
    if (sheetIDs.hasOwnProperty(y)) {
      activeSheets[y] = sheetIDs[y]
    }
  })
  return activeSheets
}

const getSpreadsheetsByType = (user_metadata, type) => {
  const activeYears = getActiveYears(user_metadata)
  const activeSheets = getActiveSpreadsheets(activeYears)
  const result = []
  for (const year in activeSheets) {
    if (activeSheets[year].hasOwnProperty(type)) {
      result.push(activeSheets[year][type])
    }
  }
  return result
}

export { searchUserInDay, getSpreadsheetsByType, zipTable }

import sheetIDs from '@root/spreadsheets'
import { makeNameCaps } from '@utils/text'
import spreadsheet_ids from '@root/spreadsheets'
import { metadata, sheets, user_metadata } from 'types/types'

export async function getUserMetadata(
  sheets: sheets,
  user: string,
  year: number
) {
  const response = (
    await sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheet_ids.meta,
      range: `data!A:F`,
    })
  ).data.values
  if (response) {
    const headers = response.shift()
    const body = searchUser(user, year, response)
    const user_metadata: user_metadata = zipTable(headers, body)
    return user_metadata
  } else {
    console.log('no response from google sheets')
  }
}

const searchUser = (user: string, year: number, data: Array<Array<string>>) => {
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
  } else {
    console.log('no user matches search')
  }
}

const searchUserInDay = (user: string, data: Array<Array<string>>) => {
  const search_res = data.filter((arr) => {
    if (arr.includes(user)) {
      return true
    } else {
      return false
    }
  })
  return search_res[0]
}

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

const getSpreadsheetsByType = (user_metadata: metadata, type: string) => {
  const start = user_metadata.GradYear - 5
  const active_years = [...Array(6)].map((_, index) => index + start)
  const result = []
  console.log('')
  console.log('== <START> ====================================')
  console.log('sheetIDs', sheetIDs)
  active_years.forEach((year) => {
    if (sheetIDs.hasOwnProperty(year) && sheetIDs[year].hasOwnProperty(type)) {
      result.push(sheetIDs[year][type])
    }
  })
  return result
}

export { searchUserInDay, getSpreadsheetsByType, zipTable }

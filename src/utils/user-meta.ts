import { upperCase } from 'utils/text'
import spreadsheet_ids from '@root/spreadsheets'
import { zipTable } from 'utils/core'
import { sheets, user_metadata } from 'types/types'

async function getUserMetadata(
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
  const full_year = ('20' + year).toString()
  const search_res = data.filter((arr) => {
    if (
      (arr.includes(user) || arr.includes(upperCase(user))) &&
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

export { getUserMetadata, searchUserInDay }

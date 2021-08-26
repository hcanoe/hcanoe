import { text } from 'utils/text'
import { zipTable, toObject } from 'utils/core'
import { user_meta } from 'types/types'
import { sheets_v4 } from 'googleapis'

async function getBase(
  sheets: sheets_v4.Sheets,
) {
  const meta_id = "17edrD9OALK56qoQoP_4DDwQdfpNBhH5P8NOyS0sKm2c"
  const response = (
    await sheets.spreadsheets.values.batchGet({
      spreadsheetId: meta_id,
      ranges: [ 'data!A:F', 'IDs!A:D' ],
    })
  ).data.valueRanges
  return response
}

async function getMetadata(
  sheets: sheets_v4.Sheets,
  user: string,
  year: number
) {
  const response = await getBase(sheets)
  if (response) {
    const meta_all = response[0].values
    const spreadsheetIds = toObject(response[1].values)

    const headers = meta_all.shift()
    const body = searchUser(user, year, meta_all)
    const meta: user_meta = zipTable(headers, body)
    return { meta, spreadsheetIds }
  } else {
    console.log('no response from google sheets')
  }
}

const searchUser = (user: string, year: number, data: Array<Array<string>>) => {
  const full_year = ('20' + year).toString()
  const search_res = data.filter((arr) => {
    if (
      (arr.includes(user) || arr.includes(text.upperCase(user))) &&
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

export { getBase, getMetadata, searchUserInDay }

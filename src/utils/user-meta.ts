import { text } from 'utils/text'
import { zipTable, toObject } from 'utils/core'
import { UserMeta } from 'types/types'
import { sheets_v4 } from 'googleapis'

/*
 * reads from the meta spreadsheet
 * retrieves team's metadata and all the other spreadsheets' ids
 */
async function base(sheets: sheets_v4.Sheets) {
  const metaId = '17edrD9OALK56qoQoP_4DDwQdfpNBhH5P8NOyS0sKm2c'
  const response = (
    await sheets.spreadsheets.values.batchGet({
      spreadsheetId: metaId,
      ranges: ['data!A:F', 'IDs!A:D'],
    })
  ).data.valueRanges
  return response
}

/*
 * searches for user in an excel array
 * matches both user and year
 * i.e. people from different batches can have the same username
 */
// TODO: add user-friendly support for commas
const searchUser = (user: string, year: number, data: Array<Array<string>>) => {
  const fullYear = ('20' + year).toString()
  const result = data.filter((arr) => {
    if (
      (arr.includes(user) || arr.includes(text.upperCase(user))) &&
      arr.includes(fullYear)
    ) {
      return true
    } else {
      return false
    }
  })
  /*
   * only continue execution if there is exactly one match
   */
  // potential feature: prompt the user to disambiguate
  const l = result.length
  if (l == 1) {
    return result[0]
  } else if (l > 1) {
    console.log('more than one user matches search')
  } else {
    console.log('no user matches search')
  }
}

namespace userMeta {
  export async function data(
    sheets: sheets_v4.Sheets,
    user: string,
    year: number
  ) {
    /*
     * retrieve basic data
     */
    const response = await base(sheets)
    if (response) {
      const teamMetadata = response[0].values
      const spreadsheetIds = toObject(response[1].values)

      /*
       * extract out just the current user's metadata
       * zip it into an object
       */
      const headers = teamMetadata.shift()
      const body = searchUser(user, year, teamMetadata)
      const meta: UserMeta = zipTable(headers, body)

      return { meta, spreadsheetIds }
    } else {
      console.log('no response from google sheets')
    }
  }
}

export { userMeta }

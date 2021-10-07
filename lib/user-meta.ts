import { text } from '@/lib/text'
import { zipTable, toObject } from '@/lib/core'
import { UserMeta } from '@/lib/types'
import { sheets_v4 } from 'googleapis'
import { log } from '@/lib/log'

/*
 * reads from the meta spreadsheet
 * retrieves team's metadata and all the other spreadsheets' ids
 */
async function base(sheets: sheets_v4.Sheets) {
  const metaId = '17edrD9OALK56qoQoP_4DDwQdfpNBhH5P8NOyS0sKm2c'
  const response = (
    await sheets.spreadsheets.values.batchGet({
      spreadsheetId: metaId,
      ranges: ['data', 'IDs'],
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

    log.divider()
    console.log('making first call to meta Google Sheet...')
    const response = await base(sheets)
    if (response) {
      console.log('got response from meta Google Sheet.')
      const teamMetadata = response[0].values
      const _spreadsheetIds = toObject(response[1].values)

      // make all keys lower case
      const spreadsheetIds = _spreadsheetIds.map((y) => {
        const keys = Object.keys(y)
        var n = keys.length
        const a = {}
        while (n--) {
          a[keys[n].toLowerCase()] = y[keys[n]]
        }
        return a
      })

      log.divider()
      console.log('IDs of spreadsheets listed in meta sheet:', spreadsheetIds)
      log.divider()

      /*
       * extract out just the current user's metadata
       * zip it into an object
       */
      const headers = teamMetadata.shift()
      const body = searchUser(user, year, teamMetadata)
      const meta: UserMeta = zipTable(headers, body)
      console.log("user's basic data:", meta)

      return { meta, spreadsheetIds }
    } else {
      console.log('no response from meta Google Sheet.')
    }
  }
}

export { userMeta }

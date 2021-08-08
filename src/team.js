import spreadsheet_ids from '@root/spreadsheets'
import {
  searchUser,
  searchUserInDay,
  getSpreadsheetsByType,
  zipTable,
} from '@utils/user-meta'
import { makeEnglish, makeNameCaps } from '@utils/text'
import { getDate } from '@utils/date'
import {
  prettifyDistance,
  prettifyIntervals,
  prettifyOnOff,
  prettifyTimed,
} from '@utils/prettify-data'


async function getMetadata(sheets) {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheet_ids.meta,
    range: `data!A:F`,
  })
  if (response) {
    return response.data.values
  } else {
    console.log('no response from google sheets')
  }
}


export async function team(query, sheets) {
  const output = {}
  const metadata = await getMetadata(sheets, spreadsheet_ids.meta, 'data!A:F')
  output.metadata = metadata

  return output
}

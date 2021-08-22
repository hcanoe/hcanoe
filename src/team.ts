import { sheets_v4 } from 'googleapis'
import { getBase } from 'utils/user-meta'

export async function team(sheets: sheets_v4.Sheets) {
  const output: any = {}

  const data = await getBase(sheets)
  console.log(data)
  return {...output}
}

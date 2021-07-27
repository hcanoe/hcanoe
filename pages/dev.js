import { google } from 'googleapis'
import sheetIDs from '@root/sheets'
import {
  searchUser,
  generateUserObject,
  expandActiveYears,
  getActiveSheets,
} from '@utils/user-meta'

export async function sourceSheetsByID(sheets, idList) {
  const result = []

  await Promise.all(
    idList.map(async (id) => {
      const response = await sheets.spreadsheets.get({
        spreadsheetId: id,
      })
      response.data.sheets.forEach((i) => {
        result.push(i.properties.title)
      })
    })
  )

  return result
}

export async function getServerSideProps({ query }) {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })
  const sheets = google.sheets({ version: 'v4', auth })

  const range = `data!A:D`

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetIDs.meta,
    range,
  })

  // get an array of IDs to source
  const getIDsToSource = (activeSheets, type) => {
    const result = []
    for (const year in activeSheets) {
      if (activeSheets[year].hasOwnProperty(type)) {
        result.push(activeSheets[year][type])
      }
    }
    return result
  }

  const log = []
  const tableData = response.data.values
  const keys = tableData.shift()

  const searchRes = searchUser('Chen Yi', tableData)
  const userObject = generateUserObject(searchRes, keys)
  const activeYears = expandActiveYears(userObject)
  const activeSheets = getActiveSheets(activeYears)
  const IDsToSource = getIDsToSource(activeSheets, 'run')
  const sheetList = await sourceSheetsByID(sheets, IDsToSource)
  log.push(sheetList)

  if (typeof log == 'undefined') {
    log = '(empty log)'
  }
  return {
    props: {
      tableData,
      log,
    },
  }
}

const Page = ({ log, tableData, name, gradYear }) => {
  console.log('-- log', log)
  const Log = JSON.stringify(log)
  const style = {
    fontFamily: 'Courier New',
  }

  return (
    <>
      <p style={style}>{Log}</p>
    </>
  )
}

export default Page

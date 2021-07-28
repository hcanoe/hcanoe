/*
 * hcanoe.vercel.app/profile/[user]
 */

const sheets = (credentials) => {
  /*
   * an object through which to make api requests
   */
  return {}
}

const user_metadata = (team_metadata_spreadsheet_id) => {
  /*
   * send request for data with team_metadata_spreadsheet_id
   * read data into an array
   * extract headers
   * search for user's row of data
   * zip the headers and data row into an object
   *
   * return an object that contains just the current user's metadata
   */
  return {}
}

const user_run_data = (user_metadata) => {
  const user_active_spreadsheet_ids = (spreadsheets.js, user_metadata) => {
    /*
     * search spreadsheets.js for sheet ids that match
     *  - username
     *  - type: run
     * for each match, save the spreadsheet id
     * return an object whose root props are the spreadsheet ids
     */
    return {}
  }
  /*
   * for each spreadsheet id,
   * send a request for data and save it under the corresponding key
   *
   * return an object:
   *   with level 1 props as spreadsheet id,
   *   and level 2 props as sheet title
   *   and with all data inside
   */
  return { result }
}

const parse_user_run_data = (sheet.data.values, user) => {
  /*
   * takes in a sheet, with a week's worth of runs
   * return an object
   */
  return {}
}

const user_run_distance_data = (user_run_data) => {
  /*
   * data fields: 
   *  - distance
   *  - timing
   *  - average pace
   *  - date
   * extras:
   *  - personal best (>=1, >=2.4, >=5)
   */
}

const user_run_intervals_data = (user_run_data) => {
  /*
   * data fields: 
   *  - sets
   *  - distances
   *  - start_interval
   *  - timings
   *  - date
   * extras:
   *  - personal best (400, 800, 1200, 1600)
   */
}

const user_run_onoff_data = (user_run_data) => {
  /*
   * data fields: 
   *  - sets
   *  - on times
   *  - off times
   *  - distance
   *  - date
   */
}

const user_run_timed_data = (user_run_data) => {
  /*
   * data fields: 
   *  - duration
   *  - distance
   *  - average pace
   *  - date
   */
}

const page_user_run = (
  user_run_distance_data,
  user_run_intervals_data,
  user_run_onoff_data
  user_run_timed_data
) => {
  /*
   * hcanoe.vercel.app/profile/[user]/run
   *
   * show run data with most recent at the top
   *  - distance
   *  - intervals
   *  - onOff
   *  - timed
   */
}

const page_user_index = () => {
  /*
   * hcanoe.vercel.app/profile/[user]
   *
   * show user data summary
   *  - goals set at season start
   *  - number of trainings
   *  - total distance ran
   *  - all time best timings
   */
}

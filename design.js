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

const page_user_run = (
  user_run_distance_data,
  user_run_interval_data,
  user_run_onoff_data
) => {
  /*
   * hcanoe.vercel.app/profile/[user]/run
   *
   * show run data with most recent at the top
   *  - distance
   *  - intervals
   *  - onOff
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

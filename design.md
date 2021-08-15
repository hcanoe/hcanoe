initialize sheets
get *year* and *user* from query
get *user's metadata* with getUserMetadata
get *name* from meta spreadsheet's name column
get *list of spreadsheets to source*
  read user's grad year
  figure out his active years
  use spreadsheets.js as a map
get *all data*
  recursively source sheets in list

import Table from '@material-ui/core/Table'
import Box from '@material-ui/core/Box'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

export const DistanceTable = ({ rows }) => {
  const data = () => {
    if (rows) {
      return (
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.date}>
              <TableCell>{row.Dist}</TableCell>
              <TableCell>{row.Time}</TableCell>
              <TableCell>{row.Pace}</TableCell>
              <TableCell>{row.Date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      )
    } else {
      return null
    }
  }
  return (
    <Box overflowX="auto">
      <Table variant="simple" size="sm">
        <TableHead>
          <TableRow>
            <TableCell>Distance</TableCell>
            <TableCell>Timing</TableCell>
            <TableCell>Pace</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        {data()}
      </Table>
    </Box>
  )
}

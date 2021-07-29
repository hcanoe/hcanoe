import { Box, Th, Tbody, Tr, Td, Thead, Table } from '@chakra-ui/react'

const DistanceTable = ({ rows }) => {
  const data = () => {
    if (rows) {
      return (
        <Tbody>
          {rows.map((row) => (
            <Tr key={row.Date}>
              <Td>{row.Distance}</Td>
              <Td>{row.Timing}</Td>
              <Td>{row.Pace}</Td>
              <Td>{row.Date}</Td>
            </Tr>
          ))}
        </Tbody>
      )
    } else {
      return null
    }
  }
  return (
    <Box overflowX="auto">
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            <Th>Distance</Th>
            <Th>Timing</Th>
            <Th>Pace</Th>
            <Th>Date</Th>
          </Tr>
        </Thead>
        {data()}
      </Table>
    </Box>
  )
}

export { DistanceTable }

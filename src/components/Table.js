import { Box, Th, Tbody, Tr, Td, Thead, Table } from '@chakra-ui/react'
import FieldBox from 'components/FieldBox'

const DistanceTable = ({ rows }) => {
  const data = () => {
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
  }
  if (rows.length === 0) {
    return (
      <p>
        <code>no distance data</code>
      </p>
    )
  } else {
    return (
      <FieldBox t="Distance">
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
      </FieldBox>
    )
  }
}

const IntervalsTable = ({ rows }) => {
  const data = () => {
    return (
      <Tbody>
        {rows.map((row) => (
          <Tr key={row.Date}>
            <Td>
              {row.Programme.map((line, index) => (
                <p key={line + index}>{line}</p>
              ))}
            </Td>
            <Td>
              {row.Timings.map((line, index) => (
                <p key={line + index}>{line.join(', ')}</p>
              ))}
            </Td>
            <Td>
              {row.Paces.map((line, index) => (
                <p key={line + index}>{line}</p>
              ))}
            </Td>
            <Td>{row.Date}</Td>
          </Tr>
        ))}
      </Tbody>
    )
  }
  if (rows.length === 0) {
    return (
      <p>
        <code>no intervals data</code>
      </p>
    )
  } else {
    return (
      <FieldBox t="Intervals">
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Programme</Th>
                <Th>Timings</Th>
                <Th>Pace</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            {data()}
          </Table>
        </Box>
      </FieldBox>
    )
  }
}

export { DistanceTable, IntervalsTable }

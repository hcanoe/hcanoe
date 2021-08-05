import { Box, Th, Tbody, Tr, Td, Thead, Table } from '@chakra-ui/react'
import FieldBox from 'components/FieldBox'
import styles from '@styles/Table.module.css'

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
  const Subline = ({ row, subtype }) => {
    return (
      <Td>
        {row[subtype].map((line, index) => (
          <p className={styles.subline} key={line + index}>{line}</p>
        ))}
      </Td>
    )
  }
  const Data = () => {
    return (
      <Tbody>
        {rows.map((row) => (
          <Tr key={row.Date}>
            <Subline row={row} subtype="Programme" />
            <Subline row={row} subtype="Timings" />
            <Subline row={row} subtype="Paces" />
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
            <Data />
          </Table>
        </Box>
      </FieldBox>
    )
  }
}

const OnOffTable = ({ rows }) => {
  const Data = () => {
    return (
      <Tbody>
        {rows.map((row) => (
          <Tr key={row.Date}>
            <Td>{row.Programme}</Td>
            <Td>{row.Distance}</Td>
            <Td>{row.Date}</Td>
          </Tr>
        ))}
      </Tbody>
    )
  }
  if (rows.length === 0) {
    return (
      <p>
        <code>no on-off data</code>
      </p>
    )
  } else {
    return (
      <FieldBox t="On-Off">
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Programme</Th>
                <Th>Distance</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Data />
          </Table>
        </Box>
      </FieldBox>
    )
  }
}

const TimedTable = ({ rows }) => {
  const Data = () => {
    return (
      <Tbody>
        {rows.map((row) => (
          <Tr key={row.Date}>
            <Td>{row.Programme}</Td>
            <Td>{row.Distance}</Td>
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
        <code>no timed data</code>
      </p>
    )
  } else {
    return (
      <FieldBox t="Timed">
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>Programme</Th>
                <Th>Distance</Th>
                <Th>Pace</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Data />
          </Table>
        </Box>
      </FieldBox>
    )
  }
}

export { DistanceTable, IntervalsTable, OnOffTable, TimedTable }

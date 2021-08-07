import { Box, Th, Tbody, Tr, Td, Thead, Table, Code } from '@chakra-ui/react'
import FieldBox from 'components/FieldBox'
import styles from '@styles/Table.module.css'

const NoData = ({ message = 'no data' }) => {
  return (
    <Code bg='gray.50' color="primary" display="block" whiteSpace="pre" mt="4" p="4">
      {message}
    </Code>
  )
}

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
    return <NoData message="no distance data" />
  } else {
    return (
      <FieldBox t="Distance">
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>DISTANCE</Th>
                <Th>TIME</Th>
                <Th>PACE</Th>
                <Th>DATE</Th>
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
          <p className={styles.subline} key={line + index}>
            {line}
          </p>
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
    return <NoData message="no intervals data" />
  } else {
    return (
      <FieldBox t="Intervals">
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>PROGRAMME</Th>
                <Th>TIMINGS</Th>
                <Th>PACE</Th>
                <Th>DATE</Th>
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
    return <NoData message="no on-off data" />
  } else {
    return (
      <FieldBox t="On-Off">
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>PROGRAMME</Th>
                <Th>DISTANCE</Th>
                <Th>DATE</Th>
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
    return <NoData message="no timed data" />
  } else {
    return (
      <FieldBox t="Timed">
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr>
                <Th>PROGRAMME</Th>
                <Th>DISTANCE</Th>
                <Th>PACE</Th>
                <Th>DATE</Th>
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

import {
  Kbd,
  Text,
  Box,
  Th,
  Tbody,
  Tr,
  Td,
  Thead,
  Table,
  Code,
} from '@chakra-ui/react'
import FieldBox from 'components/FieldBox'
import styles from '@styles/Table.module.css'
import { medalDist } from 'utils/text'
import { BsChevronUp, BsChevronDown } from 'react-icons/bs'

const NoData = ({ message = 'no data' }) => {
  return (
    <Code
      bg="gray.50"
      color="primary"
      display="block"
      whiteSpace="pre"
      mt="4"
      p="4"
    >
      {message}
    </Code>
  )
}

const medal = (best: Array<number>) => {
  if (best && best.length > 0) {
    return best.map((e, index) => (
      <Kbd
        bg="yellow.300"
        borderColor="orange.300"
        px="0.5ch"
        whiteSpace="nowrap"
        color="gray.700"
        style={medalStyle}
        key={index}
      >
        {medalDist(e)}
      </Kbd>
    ))
  } else return ''
}

const medalStyle = {
  fontSize: '10px',
  marginRight: '0.5ch',
}

const arrow = (dir: boolean, active: boolean) => {
  return active ? dir ? <BsChevronUp /> : <BsChevronDown /> : null
}
const Sorter = ({ onClick, children, arrow, type }) => {
  return (
    <Th onClick={onClick} cursor="pointer">
      <Box display="flex" flexDirection="row">
        <Text paddingRight="0.7ch">{children}</Text>
        <Text>{arrow(type.asc, type.active)}</Text>
      </Box>
    </Th>
  )
}

const DistanceTable = ({ rows, sortDate, sortPace, date, pace }) => {
  const data = () => {
    type Row = {
      date: string
      distance: string
      pace: string
      best: Array<number>
      timing: string
    }
    return (
      <Tbody>
        {rows.map((row: Row, i: number) => (
          <Tr key={row.date + i}>
            <Td>{row.distance}</Td>
            <Td>{row.timing}</Td>
            <Td>
              {row.pace}
              <div>{medal(row.best)}</div>
            </Td>
            <Td>{row.date}</Td>
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
                <Sorter onClick={sortPace} arrow={arrow} type={pace}>
                  PACE
                </Sorter>
                <Sorter onClick={sortDate} arrow={arrow} type={date}>
                  DATE
                </Sorter>
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
        {row[subtype].map((line: string, index: number) => (
          <p className={styles.subline} key={line + index}>
            {line}
          </p>
        ))}
      </Td>
    )
  }
  const Data = () => {
    type Row = {
      date: string
      distance: string
      pace: string
      best: Array<number>
      timing: string
    }
    return (
      <Tbody>
        {rows.map((row: Row, i: number) => (
          <Tr key={row.date + i}>
            <Subline row={row} subtype="programme" />
            <Subline row={row} subtype="timings" />
            <Subline row={row} subtype="paces" />
            <Td>{row.date}</Td>
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
                <Th>TIMES</Th>
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
    type Row = {
      date: string
      distance: string
      programme: string
    }
    return (
      <Tbody>
        {rows.map((row: Row, i: number) => (
          <Tr key={row.date + i}>
            <Td>{row.programme}</Td>
            <Td>{row.distance}</Td>
            <Td>{row.date}</Td>
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
    type Row = {
      date: string
      distance: string
      programme: string
      pace: string
    }
    return (
      <Tbody>
        {rows.map((row: Row, i: number) => (
          <Tr key={row.date + i}>
            <Td>{row.programme}</Td>
            <Td>{row.distance}</Td>
            <Td>{row.pace}</Td>
            <Td>{row.date}</Td>
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

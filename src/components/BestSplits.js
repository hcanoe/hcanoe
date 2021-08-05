import { DistanceTable } from 'components/Table'
import { useState } from 'react'
import FieldBox from 'components/FieldBox'
import moment from 'moment'
import { BiTrophy } from 'react-icons/bi'
import {
  displayDistance,
  displayDuration,
  durationSItoDisplay,
} from '@utils/physics'
import {
  Box,
  Th,
  Tbody,
  Tr,
  Td,
  Thead,
  Table,
  Code,
  Text,
  Button,
  Switch,
  Flex,
  Spacer,
  Icon,
} from '@chakra-ui/react'

const BestSplits = ({ data }) => {
  const dict = {
    0: 1000,
    1: 2400,
    2: 5000,
    3: 10000,
  }
  const dist = ['1 km', '2.4 km', '5 km', '10 km']
  const by_distance = Array(4)
  data.forEach((t) => {
    const pace = t.si_pace
    const dist = t.si_distance
    const time = t.si_time
    const p = {}
    // TODO: make calculations accurate to the second
    for (let i = 0; i < 4; i++) {
      if (dist >= dict[i]) {
        if (by_distance[i] === undefined) {
          by_distance[i] = {
            ...t,
            Projected: durationSItoDisplay(time / dist * dict[i]),
          }
        } else {
          if (pace < by_distance[i].si_pace) {
            by_distance[i] = {
              ...t,
              Projected: durationSItoDisplay(time / dist * dict[i]),
            }
          }
        }
      }
    }
  })

  const BestTable = ({ rows }) => {
    const DetailsHead = () => {
      return show ? (
        <>
          <Th>{'>='}</Th>
          <Th>Date</Th>
          <Th>Distance</Th>
          <Th>Timing</Th>
        </>
      ) : (
        <>
          <Th>{'>='}</Th>
          <Th>Best Pace</Th>
          <Th>Projected Time</Th>
        </>
      )
    }
    const DetailsBody = ({ row, index }) => {
      return show ? (
        <>
          <Td whiteSpace="nowrap">{dist[index]}</Td>
          <Td>{row.Date}</Td>
          <Td>{row.Distance}</Td>
          <Td>{row.Timing}</Td>
        </>
      ) : (
        <>
          <Td whiteSpace="nowrap">{dist[index]}</Td>
          <Td>{row.Pace}</Td>
          <Td>{row.Projected}</Td>
        </>
      )
    }
    const data = () => {
      return (
        <Tbody color='gray.800'>
          {rows.map((row, index) => (
            <Tr key={row.Date + index}>
              <DetailsBody row={row} index={index} />
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
            <Table variant="unstyled" size="sm">
              <Thead color='gray.600'>
                <Tr>
                  <DetailsHead />
                </Tr>
              </Thead>
              {data()}
            </Table>
          </Box>
        </FieldBox>
      )
    }
  }
  const [show, setShow] = useState(false)
  const toggleDetails = () => {
    setShow(!show)
  }
  return (
    <>
      <Box px="2px" mt="-5" mb="12">
        <Flex alignItems="baseline" justifyContent="space-between">
          <Text whiteSpace='nowrap' mt="1em" color="gray.600" fontSize="xl" fontWeight="600" verticalAlign='bottom'>
            Best splits <Icon><BiTrophy /></Icon>
          </Text>
          <Flex flexWrap="nowrap">
            <Text color="gray.500" fontWeight="600" fontSize="sm">
              ORIGINAL
            </Text>
            <Switch
              onChange={toggleDetails}
              colorScheme="teal"
              paddingLeft="1ch"
            />
          </Flex>
        </Flex>
        <FieldBox>
          <BestTable rows={by_distance} />
        </FieldBox>
      </Box>
    </>
  )
}
export default BestSplits
/*
 */

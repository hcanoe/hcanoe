import { DistanceTable } from 'components/Table'
import { useState } from 'react'
import FieldBox, { BestBox } from 'components/FieldBox'
import moment from 'moment'
import { RiVipCrownLine, RiVipCrownFill } from 'react-icons/ri'
import {
  displayDistance,
  displayDuration,
  secondsToHHMMSS,
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

const BestSplits = ({ best }) => {
  const dist = ['1 km', '2.4 km', '5 km', '10 km']
  const dict = {
    0: 1000,
    1: 2400,
    2: 5000,
    3: 10000,
  }
  const _best = []
  best.forEach((t, i) => {
    if (t) {
      const Projected = secondsToHHMMSS(
        (t.si_time / t.si_distance) * dict[i]
      )
      _best.push({ ...t, Projected })
    }
  })

  const BestTable = ({ rows }) => {
    const DetailsHead = () => {
      return show ? (
        <>
          <Th>{'>='}</Th>
          <Th>DATE</Th>
          <Th>DISTANCE</Th>
          <Th>TIME</Th>
        </>
      ) : (
        <>
          <Th>{'>='}</Th>
          <Th>PACE</Th>
          <Th>SPLIT</Th>
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
        <Tbody color="gray.800">
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
        <Box overflowX="auto">
          <Table variant="unstyled" size="sm">
            <Thead color="gray.600">
              <Tr>
                <DetailsHead />
              </Tr>
            </Thead>
            {data()}
          </Table>
        </Box>
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
        <BestBox>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            px="16px"
            mb="4px"
          >
            <Text
              whiteSpace="nowrap"
              color="gray.600"
              fontSize="xl"
              fontWeight="600"
              verticalAlign="center"
            >
              Best splits{' '}
              <Icon color="#fec835">
                <RiVipCrownFill />
              </Icon>
            </Text>
            <Flex flexWrap="nowrap" alignItems="center">
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
          <BestTable rows={_best} />
        </BestBox>
      </Box>
    </>
  )
}
export default BestSplits

import { IntervalsTable } from 'components/Table'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Flex,
  Box,
  Grid,
  Button,
} from '@chakra-ui/react'
import { useState } from 'react'

const SetNu = ({ min, max, step, width, c }) => {
  return (
    <NumberInput
      min={min}
      max={max}
      step={step}
      width={width}
      float="right"
      onChange={c}
    >
      <NumberInputField />
      <NumberInputStepper></NumberInputStepper>
    </NumberInput>
  )
}

const getResults = (d, set, dist) => {
  const result = []
  d.forEach((training) => {
    if (training.Programme.length > 1) {
      return
    }
    var c = 0
    if (set === '') {
      if (training.Set1 === dist) {
        result.push(training)
      } else if (dist === 'm') {
        result.push(training)
      }
    } else {
      for (const i in training) {
        if (i.replace(/[0-9]/g, '') === 'Set') {
          c += 1
        }
      }
    }
    if (dist === 'm') {
      if (c === set) {
        result.push(training)
      }
    } else {
      if (c === set && training.Set1 === dist) {
        result.push(training)
      }
    }
  })
  return result
}

const Intervals = ({ rows }) => {
  const [filteredRows, setFilteredRows] = useState(rows)
  const [sets, setSets] = useState('')
  const [distance, setDistance] = useState('')

  const onChangeSet = (e) => {
    setSets(e)
    if (e === '' && distance === '') {
      setFilteredRows(rows)
    }
  }
  const onChangeDistance = (e) => {
    setDistance(e)
    if (e === '' && sets === '') {
      setFilteredRows(rows)
    }
  }
  const handleSearch = () => {
    const query = {
      sets: sets === '' ? '' : parseInt(sets),
      distance: distance + 'm',
    }
    const result = getResults(rows, query.sets, query.distance)
    setFilteredRows(result)
  }
  return (
    <>
      <Flex
        mt="-0.5em"
        mb="1.6em"
        flexDirection="row"
        flexWrap="wrap"
        gridGap={3}
        alignItems="flex-end"
        justifyContent="space-between"
        // bg="green.200"
      >
        <Flex flexDirection="row" flexWrap="wrap">
          <Box paddingRight="2ch">
            <Text paddingRight="1ch">Sets</Text>
            <SetNu min={0} max={20} step={1} width="11ch" c={onChangeSet} />
          </Box>
          <Box>
            <Text paddingRight="1ch">Distance</Text>
            <SetNu
              min={0}
              max={2000}
              step={100}
              width="11ch"
              c={onChangeDistance}
            />
          </Box>
        </Flex>
        <Button colorScheme="teal" onClick={handleSearch}>
          Search
        </Button>
      </Flex>
      <IntervalsTable rows={filteredRows} />
    </>
  )
}

export default Intervals

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
  console.log('set:', set, typeof set, 'dist:', dist, typeof dist)
  const result = []
  d.forEach((training) => {
    var c = 0
    for (const i in training) {
      if (i.replace(/[0-9]/g, '') === 'Set') {
        c += 1
      }
    }
    if (training.Programme.length === 1) {
      if ((training.Set1 === dist && (c === set || set === '')) || (dist === 'm' && c === set)) {
        result.push(training)
      }
    }
  })
  console.log(result)
  return result
}

const Intervals = ({ rows }) => {
  const [filteredRows, setFilteredRows] = useState(rows)
  const [sets, setSets] = useState(0)
  const [distance, setDistance] = useState(0)

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
    console.log(typeof sets)
    console.log('all data', rows)
    const query = {
      sets: (sets === '') ? '' : parseInt(sets),
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
        <Box>
          <Button colorScheme="blue" onClick={handleSearch}>
            Search
          </Button>
        </Box>
      </Flex>
      <IntervalsTable rows={filteredRows} />
    </>
  )
}

export default Intervals

import { IntervalsTable } from '@/components/Table'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
  Flex,
  Box,
  Button,
} from '@chakra-ui/react'
import { useState } from 'react'

const SetNu = ({ min, max, step, width, c }) => {
  return (
    <NumberInput
      min={min}
      max={max}
      step={step}
      size="sm"
      width={width}
      float="right"
      onChange={c}
    >
      <NumberInputField />
      <NumberInputStepper></NumberInputStepper>
    </NumberInput>
  )
}
const Search = ({ onChangeSet, onChangeDistance, handleSearch }) => {
  return (
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
          <Text fontSize="sm" paddingRight="1ch">
            Sets
          </Text>
          <SetNu min={0} max={20} step={1} width="11ch" c={onChangeSet} />
        </Box>
        <Box>
          <Text fontSize="sm" paddingRight="1ch">
            Distance
          </Text>
          <SetNu
            min={0}
            max={2000}
            step={100}
            width="11ch"
            c={onChangeDistance}
          />
        </Box>
      </Flex>
      <Button size="sm" colorScheme="teal" onClick={handleSearch}>
        Search
      </Button>
    </Flex>
  )
}

type data = Array<{
  programme: string,
  [propName: string]: string
}>

const getResults = (d: data, set: number | string, dist: string) => {
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
        if (i.replace(/[0-9]/g, '') === 'set') {
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

  const onChangeSet = (e: string) => {
    setSets(e)
    if (e === '' && distance === '') {
      setFilteredRows(rows)
    }
  }
  const onChangeDistance = (e: string) => {
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
      <Search
        onChangeDistance={onChangeDistance}
        onChangeSet={onChangeSet}
        handleSearch={handleSearch}
      />
      <IntervalsTable rows={filteredRows} />
    </>
  )
}

export default Intervals

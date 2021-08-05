import { DistanceTable } from 'components/Table'
import { useState } from 'react'
import FieldBox from 'components/FieldBox'
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
} from '@chakra-ui/react'

const Distance = ({ rows }) => {
  const [filteredRows, setFilteredRows] = useState(rows)

  return (
    <>
      <DistanceTable rows={filteredRows} />
    </>
  )
}
export default Distance

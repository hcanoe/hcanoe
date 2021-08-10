import { DistanceTable } from 'components/Table'
import { useState } from 'react'

const Distance = ({ rows }) => {
  const [filteredRows, setFilteredRows] = useState(rows)

  return (
    <>
      <DistanceTable rows={filteredRows} />
    </>
  )
}
export default Distance

import { DistanceTable } from 'components/Table'
import { useState } from 'react'
import { by_date, by_pace } from 'utils/sort'

const Distance = ({ rows }) => {
  const [date, setDate] = useState({asc: true, active: true})
  const [pace, setPace] = useState({asc: true, active: false})
  const [filteredRows, setFilteredRows] = useState(rows.sort(by_date))

  function sortDate() {
    if (date.active) {
      setFilteredRows([...filteredRows.reverse()])
      setDate({asc: !date.asc, active: true})
    } else {
      setFilteredRows([...rows.sort(by_date)])
      setDate({asc: true, active: true})
    }
    setPace(Object.assign(pace, {active: false}))
  }
  function sortPace() {
    if (pace.active) {
      setFilteredRows([...filteredRows.reverse()])
      setPace({asc: !pace.asc, active: true})
    } else {
      setFilteredRows([...rows.sort(by_pace)])
      setPace({asc: true, active: true})
    }
    setDate(Object.assign(date, {active: false}))
  }
  return (
    <>
      <DistanceTable rows={filteredRows} sortDate={sortDate} sortPace={sortPace} date={date} pace={pace}/>
    </>
  )
}
export default Distance

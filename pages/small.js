import { getDate } from '@utils/date'

const Page = () => {
  const date = '20/7/2015'
  const day = 'thursday'

  console.log(getDate(date, day))
  return (
    null
  )
}
export default Page

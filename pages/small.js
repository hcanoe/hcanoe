import { getDate } from '@utils/date'
import { getPace } from '@utils/physics'

const Page = () => {
  const dur = '1:35:42'
  const dist = '21.0975km'

  console.log(getPace(dur, dist))

  return (
    null
  )
}
export default Page

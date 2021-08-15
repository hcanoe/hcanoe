import { displayPace, toSeconds } from 'utils/physics'

const Page = () => {
  const time = toSeconds('20:26')
  const distance = 4500
  console.log(displayPace(time, distance))
  return null
}
export default Page

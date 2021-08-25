import { displayPace, toSeconds } from 'utils/physics'

namespace testSpace {
  export function meme() {
    return 'memelord'
  }
}

const Page = () => {
  const time = toSeconds('20:26')
  const distance = 4500
  console.log(displayPace(time, distance))
  console.log(testSpace.meme())
  return null
}
export default Page

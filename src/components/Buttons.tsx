import { AiOutlineHome } from 'react-icons/ai'
import { Button } from '@chakra-ui/react'

const HomeButton = () => {
  return (
    <Button variant='ghost' onClick={() => window.location = '/'}>
      <AiOutlineHome size="20" />
    </Button>
  )
}

export { HomeButton }

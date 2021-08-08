import { AiOutlineHome } from 'react-icons/ai'
import { Flex } from '@chakra-ui/react'

const HomeButton = () => {
  return (
    <a href="/">
      <Flex
        as="button"
        h="40px"
        w="40px"
        alignItems="center"
        justifyContent="center"
        borderRadius="50%"
        className="noselect"
        color="teal.350"
        _hover={{ bg: 'rgba(0, 0, 0, 0.1)' }}
        _active={{ bg: 'rgba(0, 0, 0, 0.2)' }}
      >
        <AiOutlineHome size="20" />
      </Flex>
    </a>
  )
}

export { HomeButton }

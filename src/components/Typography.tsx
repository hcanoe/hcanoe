import { Text } from '@chakra-ui/react'

const Title = ({ t }) => {
  return (
    <Text mt="1em" color="primary" fontSize="3xl" fontWeight="800">
      {t}
    </Text>
  )
}
const Name = ({ n }) => {
  return (
    <Text color="gray.500" mb="10">
      {n}
    </Text>
  )
}

export { Title, Name }

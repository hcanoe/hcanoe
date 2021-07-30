import { Text, Box, Heading } from '@chakra-ui/react'

const FieldBox = ({ t, children, c = '#fc4c02' }) => {
  return (
    <Box borderRadius="lg" mt="1.75rem" shadow="base" p="1em">
      <Text
        bgGradient="linear(to-r, blue.500, teal.900)"
        bgClip="text"
        fontSize="lg"
        fontWeight="extrabold"
        mb="0.8em"
      >
        {t}
      </Text>
      {children}
    </Box>
  )
}
export default FieldBox

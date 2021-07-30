import { Text, Box, Heading } from '@chakra-ui/react'

const FieldBox = ({ t, children, c = '#fc4c02' }) => {
  return (
    <Box borderRadius="lg" mt="1.75rem" shadow="base" p="1em">
      <Text
        color="#429E90"
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

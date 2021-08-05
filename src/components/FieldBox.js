import { Text, Box, Heading } from '@chakra-ui/react'

const FieldBox = ({ t, children, c = '#fc4c02' }) => {
  return (
    <Box borderRadius="lg" shadow="base" pt="0.5em">
      {children}
    </Box>
  )
}
export default FieldBox

/*
      <Text
        color="#429E90"
        fontSize="lg"
        fontWeight="extrabold"
        mb="0.8em"
      >
        {t}
      </Text>
*/

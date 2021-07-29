import { Box, Heading } from '@chakra-ui/react'

const FieldBox = ({ t, children, c='#fc4c02' }) => {
  return (
    <Box
      borderRadius='lg'
      mt="1.75rem"
      shadow="lg"
      border="1px"
      p="1em"
      borderColor={c}
    >
      <Heading size="md" mb="0.8em">
        {t}
      </Heading>
      {children}
    </Box>

  )
}
export default FieldBox

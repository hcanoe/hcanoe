import { Text, Box, Heading } from '@chakra-ui/react'
import styles from 'styles/FieldBox.module.css'

const FieldBox = ({ t, children, c = '#fc4c02' }) => {
  return (
    <Box
      borderRadius="lg"
      shadow="base"
      pt="0.5em"
      className={styles.field}
    >
      {children}
    </Box>
  )
}

const BestBox = ({ t, children, c = '#fc4c02' }) => {
  return (
    <Box
      borderRadius="lg"
      shadow="base"
      pt="0.5em"
    >
      {children}
    </Box>
  )
}
export default FieldBox
export { BestBox }

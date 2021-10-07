import { Box } from '@chakra-ui/react'
import styles from 'styles/FieldBox.module.css'

type FieldBox = {
  children: object,
  t?: string,
  c?: string
}

const FieldBox = ({ children }: FieldBox) => {
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

const BestBox = ({ children }: FieldBox) => {
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

import { Box, Typography } from '@material-ui/core'

const FieldBox = ({ t, children, c = '#fc4c02' }) => {
  return (
    <Box
    >
      <Typography>
        {t}
      </Typography>
      {children}
    </Box>
  )
}
export default FieldBox

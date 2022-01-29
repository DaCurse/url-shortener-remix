import type { AlertColor, SnackbarCloseReason } from '@mui/material'
import { Alert, Snackbar } from '@mui/material'
import type { SyntheticEvent } from 'react'
import { useState } from 'react'

const AUTO_HIDE_DURATION = 5000

interface AlertSnackbarProps {
  message: string
  severity?: AlertColor
  autoHideDuration?: number
}

export default function AlertSnackbar({
  message,
  severity,
  autoHideDuration = AUTO_HIDE_DURATION,
}: AlertSnackbarProps) {
  const [open, setOpen] = useState(true)

  function handleClose(
    _event: Event | SyntheticEvent<Element, Event>,
    reason?: SnackbarCloseReason
  ) {
    if (reason === 'clickaway') {
      return
    }

    setOpen(false)
  }

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={autoHideDuration}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

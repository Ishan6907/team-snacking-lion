import { Alert, AlertTitle, Button } from '@mui/material';

interface ErrorAlertProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorAlert({
  title = 'Something went wrong',
  message,
  onRetry,
}: ErrorAlertProps) {
  return (
    <Alert
      severity="error"
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
      sx={{ mb: 2 }}
    >
      <AlertTitle>{title}</AlertTitle>
      {message}
    </Alert>
  );
}

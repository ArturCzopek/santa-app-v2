import React, { createContext, useCallback, useContext, useState } from 'react';
import { Alert, AlertColor, Snackbar } from '@mui/material';

type Notify = (message: string, severity?: AlertColor) => void;

const NotifyContext = createContext<Notify | null>(null);

interface Notification {
  message: string;
  severity: AlertColor;
  // A new key restarts the snackbar when the same message comes again.
  key: number;
}

// One snackbar for the whole app, used instead of alert().
export const NotifyProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [open, setOpen] = useState(false);

  const notify = useCallback<Notify>((message, severity = 'error') => {
    setNotification({ message, severity, key: Date.now() });
    setOpen(true);
  }, []);

  const handleClose = (_event?: unknown, reason?: string) => {
    if (reason !== 'clickaway') setOpen(false);
  };

  return (
    <NotifyContext.Provider value={notify}>
      {children}
      <Snackbar
        key={notification?.key}
        open={open}
        // Errors stay until closed: they often say what to do next.
        autoHideDuration={notification?.severity === 'error' ? null : 6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={notification?.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </NotifyContext.Provider>
  );
};

export const useNotify = () => {
  const notify = useContext(NotifyContext);
  if (!notify) {
    throw new Error('useNotify must be used inside <NotifyProvider>');
  }
  return notify;
};

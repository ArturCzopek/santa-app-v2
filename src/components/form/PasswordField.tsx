import React, { useState } from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  TextFieldProps,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { tokens } from '../../styles/theme';

type PasswordFieldProps = Omit<TextFieldProps, 'onChange' | 'error'> & {
  value: string;
  onChange: (value: string) => void;
  error?: string | null;
};

// A password input with a show/hide toggle.
const PasswordField = React.forwardRef<HTMLDivElement, PasswordFieldProps>(
  ({ value, onChange, error, helperText, slotProps, ...props }, ref) => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);

    return (
      <TextField
        ref={ref}
        {...props}
        fullWidth
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={!!error}
        // The hint stays under the error: it says what to do, exactly when
        // it is needed ("Hasło dostajesz od organizatora.").
        helperText={
          error && helperText ? (
            <>
              {error}
              <Box
                component="span"
                sx={{ display: 'block', color: tokens.inkMuted }}
              >
                {helperText}
              </Box>
            </>
          ) : (
            error || helperText
          )
        }
        slotProps={{
          ...slotProps,
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    visible
                      ? t('common.hidePassword')
                      : t('common.showPassword')
                  }
                  onClick={() => setVisible(!visible)}
                  edge="end"
                >
                  {visible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />
    );
  },
);

PasswordField.displayName = 'PasswordField';

export default PasswordField;

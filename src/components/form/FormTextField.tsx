import React from 'react';
import { TextField, TextFieldProps, useTheme } from '@mui/material';
import { Controller, Control, RegisterOptions } from 'react-hook-form';
import {
  inputStyles,
  inputLabelStyles,
  errorStyles,
} from '../../styles/formStyles';

interface FormTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  control: Control<any>;
  rules?: RegisterOptions;
}

const FormTextField: React.FC<FormTextFieldProps> = ({
  name,
  control,
  rules,
  ...props
}) => {
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          {...props}
          error={!!error}
          helperText={error?.message}
          InputProps={{
            sx: inputStyles(theme),
          }}
          InputLabelProps={{
            sx: inputLabelStyles(theme),
          }}
          sx={errorStyles(theme)}
        />
      )}
    />
  );
};

export default FormTextField;

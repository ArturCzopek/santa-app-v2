import React from 'react';
import { TextField, TextFieldProps, useTheme } from '@mui/material';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import {
  inputStyles,
  inputLabelStyles,
  errorStyles,
} from '../../styles/formStyles';

type FormTextFieldProps<T extends FieldValues, N extends Path<T>> = Omit<
  TextFieldProps,
  'name'
> & {
  name: N;
  control: Control<T>;
  rules?: RegisterOptions<T, N>;
};

const FormTextField = <T extends FieldValues, N extends Path<T>>({
  name,
  control,
  rules,
  ...props
}: FormTextFieldProps<T, N>) => {
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

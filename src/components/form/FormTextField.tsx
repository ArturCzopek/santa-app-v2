import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';

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
  helperText,
  ...props
}: FormTextFieldProps<T, N>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { ref, ...field }, fieldState: { error } }) => (
      <TextField
        {...field}
        {...props}
        // Lets react-hook-form move focus to the first invalid field.
        inputRef={ref}
        error={!!error}
        helperText={error?.message ?? helperText}
      />
    )}
  />
);

export default FormTextField;

import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectProps,
} from '@mui/material';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';

type FormSelectProps<T extends FieldValues, N extends Path<T>> = Omit<
  SelectProps,
  'name'
> & {
  name: N;
  control: Control<T>;
  label: string;
  options: Array<{ value: string; label: string }>;
  rules?: RegisterOptions<T, N>;
};

const FormSelect = <T extends FieldValues, N extends Path<T>>({
  name,
  control,
  label,
  options,
  rules,
  ...props
}: FormSelectProps<T, N>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field: { ref, ...field }, fieldState: { error } }) => (
      <FormControl fullWidth error={!!error}>
        <InputLabel id={`${name}-label`}>{label}</InputLabel>
        <Select
          {...field}
          {...props}
          inputRef={ref}
          labelId={`${name}-label`}
          label={label}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {error && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    )}
  />
);

export default FormSelect;

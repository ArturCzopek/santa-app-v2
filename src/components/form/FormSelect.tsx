import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectProps,
  useTheme,
} from '@mui/material';
import {
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
} from 'react-hook-form';
import {
  inputLabelStyles,
  formSelectContainerStyles,
  formSelectStyles,
  formSelectMenuProps,
} from '../../styles/formStyles';

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
}: FormSelectProps<T, N>) => {
  const theme = useTheme();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          fullWidth
          error={!!error}
          sx={formSelectContainerStyles(theme)}
        >
          <InputLabel id={`${name}-label`} sx={inputLabelStyles(theme)}>
            {label}
          </InputLabel>
          <Select
            {...field}
            {...props}
            labelId={`${name}-label`}
            label={label}
            sx={formSelectStyles(theme)}
            MenuProps={formSelectMenuProps(theme)}
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
};

export default FormSelect;

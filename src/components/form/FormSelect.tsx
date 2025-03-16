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
import { Controller, Control, RegisterOptions } from 'react-hook-form';
import {
  inputLabelStyles,
  errorStyles,
} from '../../styles/formStyles';

interface FormSelectProps extends Omit<SelectProps, 'name'> {
  name: string;
  control: Control<any>;
  label: string;
  options: Array<{ value: string; label: string }>;
  rules?: RegisterOptions;
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  control,
  label,
  options,
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
        <FormControl
          fullWidth
          error={!!error}
          sx={{
            ...errorStyles(theme),
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.6)',
              borderWidth: '2px',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(255, 255, 255, 0.8)',
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: theme.customColors.gold,
              borderWidth: '2px',
            },
          }}
        >
          <InputLabel id={`${name}-label`} sx={inputLabelStyles(theme)}>
            {label}
          </InputLabel>
          <Select
            {...field}
            {...props}
            labelId={`${name}-label`}
            label={label}
            sx={{
              color: theme.palette.text.primary,
              '& .MuiSelect-icon': {
                color: 'rgba(255, 255, 255, 0.8)',
              },
            }}
            MenuProps={{
              PaperProps: {
                sx: {
                  bgcolor: theme.customColors.darkGray,
                  '& .MuiMenuItem-root': {
                    color: 'white',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                    '&.Mui-selected': {
                      bgcolor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.3)',
                      },
                    },
                  },
                },
              },
            }}
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

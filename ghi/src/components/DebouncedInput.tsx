import * as React from 'react';
import Input, { InputProps } from '@mui/joy/Input';
import TextArea from '@mui/joy/TextArea';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

type DebounceProps = {
  handleDebounce: (value: string) => void;
  debounceTimeout: number;
};

export function DebounceTextArea(props: any) {
  const { handleDebounce, debounceTimeout, inputRef, ...rest } = props;
  const timerRef = React.useRef<number>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      handleDebounce(event.target.value);
    }, debounceTimeout);
  };

  return (
    <TextArea
      {...rest}
      ref={inputRef}
      onChange={handleChange}
      variant="soft"
      id="debounce-input"
      minRows={5}
      maxRows={5}
      sx={{
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderRadius: 0,
        '&:hover': {
          borderWidth: 0,
        },
        '&::before': {
          borderWidth: 0,
          transform: 'scaleX(0)',
          left: 0,
          right: 0,
          bottom: '-2px',
          top: 'unset',
          borderRadius: 0,
        },
        '&:focus-within::before': {
          transform: 'scaleX(1)',
        },
      }}
    />
  );
}

function DebounceInput(props: any) {
  const { handleDebounce, debounceTimeout, inputRef, ...rest } = props;

  const timerRef = React.useRef<number>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
      handleDebounce(event.target.value);
    }, debounceTimeout);
  };

  return (
    <Input
      {...rest}
      ref={inputRef}
      onChange={handleChange}
      variant="plain"
      id="debounce-input"
      sx={{
        backgroundColor: 'transparent',
        '&::before': {
          borderWidth: 0,
          transform: 'scaleX(0)',
          backgroundColor: 'transparent',
          left: '2.5px',
          right: '2.5px',
          bottom: 0,
          top: 'unset',
        },
        '&:focus-within::before': {
          transform: 'scaleX(1)',
          backgroundColor: 'transparent',
        },
      }}
    />
  );
}

export function DebouncedInput() {
  const [debouncedValue, setDebouncedValue] = React.useState('');
  const handleDebounce = (value: string) => {
    setDebouncedValue(value);
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <DebounceInput
        placeholder="Type in here…"
        debounceTimeout={1000}
        handleDebounce={handleDebounce}
      />
      <Typography>Debounced input: {debouncedValue}</Typography>
    </Box>
  );
}

export default DebounceInput;

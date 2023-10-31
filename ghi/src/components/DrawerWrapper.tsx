import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

export default function FormDrawer({
  buttonText = 'open drawer',
  children,
}: {
  buttonText?: string;
  children: React.ReactNode;
}): JSX.Element {
  const [state, setState] = React.useState(false);

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState(open);
    };

  return (
    <div>
      <React.Fragment>
        <button
          className="btn btn-outline-primary"
          onClick={toggleDrawer(true)}
        >
          {buttonText}
        </button>
        <Drawer anchor={'right'} open={state} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              // width: '40vw',
              width: '800px',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: '#303030',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
            }}
            role="presentation"
          >
            {children}
          </Box>
        </Drawer>
      </React.Fragment>
    </div>
  );
}

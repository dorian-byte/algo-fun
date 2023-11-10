import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

export default function FormDrawer({
  width = '50vw',
  buttonText = 'Open Drawer',
  children,
  renderOpenner,
}: {
  width?: string;
  buttonText?: string;
  children: React.ReactNode;
  renderOpenner?: (cb: () => void) => React.ReactNode;
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
        {renderOpenner && renderOpenner(() => toggleDrawer(true))}
        {!renderOpenner && (
          <button
            className="btn btn-outline-primary"
            onClick={toggleDrawer(true)}
          >
            {buttonText}
          </button>
        )}
        <Drawer anchor={'right'} open={state} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              width,
              // width: '800px',
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

import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1920px',
          margin: '0 auto',
          // padding: { xs: 2, sm: 3, md: 4 },
          position: 'relative'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme, CssBaseline } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const DRAWER_WIDTH = 240;
  const CLOSED_DRAWER_WIDTH = 73;

  const handleDrawerToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: theme.palette.background.default,
        overflow: 'hidden' 
      }}
    >
      <CssBaseline />
      
      <Header 
        onSidebarToggle={handleDrawerToggle}
        sx={{
          width: '100%',
          position: 'fixed',
          top: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: '100%',
            sm: `calc(100% - ${isSidebarOpen ? DRAWER_WIDTH : CLOSED_DRAWER_WIDTH}px)`
            
          },
          marginTop: '64px', // Height of the header
          minHeight: 'calc(100vh - 64px)', // Subtract header height
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        }}
      >
        <Box 
          sx={{ 
            flex: '1 0 auto',
            width: '100%',
            maxWidth: '100%'
          }}
        >
          <Outlet />
        </Box>
        <Footer 
          sx={{
            flexShrink: 0,
            width: '100%'
          }}
        />
      </Box>
    </Box>
  );
};

export default MainLayout;
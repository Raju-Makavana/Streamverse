import { Box, CircularProgress, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const CustomLoader = ({ message = "Loading amazing content for you..." }) => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        zIndex: 9999,
        gap: 3
      }}
    >
      <CircularProgress 
        size={60}
        thickness={4}
        sx={{
          color: 'primary.main',
        }}
      />
      <Typography 
        variant="h6" 
        color="grey.500"
        textAlign="center"
        sx={{ 
          maxWidth: 400,
          px: 2
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default CustomLoader;
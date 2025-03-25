import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { Close, Lock, Login } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AuthDialog = ({ open, onClose, title, message }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleSignup = () => {
    onClose();
    navigate('/register');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        style: {
          borderRadius: 8,
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.dark',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lock />
          <Typography variant="h6">
            {title || 'Authentication Required'}
          </Typography>
        </Box>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 3, bgcolor: '#1a1a1a', color: 'white' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {message || 'Please login or create an account to access this feature.'}
        </Typography>
        
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          mt: 3,
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box 
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'rgba(0,0,0,0.2)',
              width: '100%',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer'
            }}
            onClick={handleLogin}
          >
            <Login sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h6" color="primary.main">
              Sign In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Already have an account? Sign in to continue
            </Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
            OR
          </Typography>
          
          <Box 
            component={motion.div}
            whileHover={{ scale: 1.05 }}
            sx={{
              p: 3,
              borderRadius: 2,
              bgcolor: 'rgba(0,0,0,0.2)',
              width: '100%',
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.1)',
              cursor: 'pointer'
            }}
            onClick={handleSignup}
          >
            <Typography variant="h6" color="info.main">
              Create New Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              New to Streamverse? Sign up for free
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ p: 2, bgcolor: '#1a1a1a', justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleLogin} 
          variant="contained" 
          color="primary" 
          startIcon={<Login />}
        >
          Sign In
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog; 
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  IconButton,
  CircularProgress,
  Container,
  Divider,
  Button,
  Alert,
  Snackbar,
  LinearProgress
} from '@mui/material';
import { PlayArrow, Info, Delete, History as HistoryIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMediaUrl } from '../config/getMediaUrl';
import { motion } from 'framer-motion';
import axios from 'axios';
import { getEnvConfig } from '../config/envConfig';

const url = getEnvConfig.get("backendURI");

const History = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchHistory();
    } else {
      setError('You need to login to view your watch history');
    }
  }, [isAuthenticated]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/user/history`, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setHistoryItems(response.data.data || []);
      } else {
        setError('Failed to fetch watch history');
      }
    } catch (error) {
      console.error('Error fetching watch history:', error);
      setError('An error occurred while fetching your watch history');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromHistory = async (mediaId) => {
    try {
      const response = await axios.post(`${url}/user/history/remove`, { mediaId }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setHistoryItems(historyItems.filter(item => item.media._id !== mediaId));
        setFeedback({
          open: true,
          message: 'Removed from watch history',
          severity: 'success'
        });
      } else {
        setFeedback({
          open: true,
          message: response.data.message || 'Failed to remove from history',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error removing from history:', error);
      setFeedback({
        open: true,
        message: 'An error occurred',
        severity: 'error'
      });
    }
  };

  const handleClearAllHistory = async () => {
    try {
      const response = await axios.post(`${url}/user/history/clear`, {}, {
        withCredentials: true
      });
      
      if (response.data.success) {
        setHistoryItems([]);
        setFeedback({
          open: true,
          message: 'Watch history cleared',
          severity: 'success'
        });
      } else {
        setFeedback({
          open: true,
          message: response.data.message || 'Failed to clear history',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error clearing history:', error);
      setFeedback({
        open: true,
        message: 'An error occurred',
        severity: 'error'
      });
    }
  };

  const handlePlayClick = (mediaId, watchProgress) => {
    navigate(`/media/${mediaId}/watch`, { 
      state: { startTime: watchProgress }
    });
  };

  const handleDetailsClick = (mediaId) => {
    navigate(`/media/${mediaId}`);
  };

  const closeFeedback = () => {
    setFeedback({ ...feedback, open: false });
  };

  // Format date to display how long ago it was watched
  const formatWatchDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Calculate progress percentage
  const calculateProgress = (current, duration) => {
    if (!current || !duration) return 0;
    return Math.min(Math.floor((current / duration) * 100), 100);
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: 8, minHeight: 'calc(100vh - 250px)' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 8,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" gutterBottom>Please login to view your watch history</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3 }}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 8, minHeight: 'calc(100vh - 200px)' }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 3
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          color="white" 
          sx={{
            fontWeight: 700,
            letterSpacing: '0.5px',
            borderLeft: '4px solid',
            borderColor: 'primary.main',
            pl: 2
          }}
        >
          Watch History
        </Typography>
        
        {historyItems.length > 0 && (
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<Delete />}
            onClick={handleClearAllHistory}
          >
            Clear All
          </Button>
        )}
      </Box>
      
      <Divider sx={{ mb: 4, opacity: 0.3 }} />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
      ) : historyItems.length > 0 ? (
        <Grid container spacing={3}>
          {historyItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
              <Card 
                component={motion.div}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                sx={{ 
                  bgcolor: '#1a1a1a', 
                  height: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
                  '&:hover .media-info': {
                    opacity: 1
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height={320}
                    image={getMediaUrl(item.media?.posterUrl, 'poster')}
                    alt={item.media?.title}
                    sx={{ 
                      borderRadius: '8px 8px 0 0',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  
                  {/* Watch progress bar */}
                  <LinearProgress 
                    variant="determinate" 
                    value={calculateProgress(item.watchProgress, item.media?.duration)} 
                    color="primary"
                    sx={{ 
                      height: 4,
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0
                    }}
                  />
                  
                  {/* Overlay info on hover */}
                  <Box 
                    className="media-info"
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      p: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PlayArrow />}
                        onClick={() => handlePlayClick(item.media?._id, item.watchProgress)}
                      >
                        {calculateProgress(item.watchProgress, item.media?.duration) >= 95 
                          ? 'Rewatch' 
                          : 'Continue'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<Info />}
                        onClick={() => handleDetailsClick(item.media?._id)}
                        sx={{ borderColor: 'white', color: 'white' }}
                      >
                        Details
                      </Button>
                    </Box>
                    <Typography variant="body2" textAlign="center" sx={{ mb: 2 }}>
                      {item.media?.plot?.substring(0, 100)}...
                    </Typography>
                    <Typography variant="body2" color="primary.light" sx={{ mt: 1 }}>
                      {calculateProgress(item.watchProgress, item.media?.duration)}% completed
                    </Typography>
                  </Box>
                  
                  {/* Remove from history button */}
                  <IconButton
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'error.light',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.7)'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromHistory(item.media?._id);
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                  
                  {/* Last watched badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    <HistoryIcon fontSize="inherit" />
                    {formatWatchDate(item.lastWatched)}
                  </Box>
                </Box>
                
                <CardContent>
                  <Typography variant="h6" component="div" noWrap>
                    {item.media?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.media?.year} • {item.media?.type}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6">Your watch history is empty</Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Start watching content to build your history
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3 }}
            onClick={() => navigate('/movies')}
          >
            Browse Movies
          </Button>
        </Box>
      )}
      
      <Snackbar 
        open={feedback.open} 
        autoHideDuration={3000} 
        onClose={closeFeedback}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={closeFeedback} 
          severity={feedback.severity} 
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default History; 
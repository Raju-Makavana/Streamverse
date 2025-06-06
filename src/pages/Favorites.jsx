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
  Snackbar
} from '@mui/material';
import { Favorite, PlayArrow, Info } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getFavoritesList, removeFromFavorites } from '../apis/mediaApis';
import { getMediaUrl } from '../config/getMediaUrl';
import { motion } from 'framer-motion';

const Favorites = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setError('You need to login to view your favorites');
    }
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await getFavoritesList();
      if (response.success) {
        setFavorites(response.data || []);
      } else {
        setError('Failed to fetch favorites');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('An error occurred while fetching favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromFavorites = async (mediaId) => {
    try {
      const response = await removeFromFavorites(mediaId);
      if (response.success) {
        setFavorites(favorites.filter(item => item.media._id !== mediaId));
        setFeedback({
          open: true,
          message: 'Removed from favorites',
          severity: 'success'
        });
      } else {
        setFeedback({
          open: true,
          message: response.message || 'Failed to remove from favorites',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      setFeedback({
        open: true,
        message: 'An error occurred',
        severity: 'error'
      });
    }
  };

  const handlePlayClick = (mediaId) => {
    navigate(`/media/${mediaId}/watch`);
  };

  const handleDetailsClick = (mediaId) => {
    navigate(`/media/${mediaId}`);
  };

  const closeFeedback = () => {
    setFeedback({ ...feedback, open: false });
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
          <Typography variant="h5" gutterBottom>Please login to view your favorites</Typography>
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
      <Typography 
        variant="h4" 
        component="h1" 
        color="white" 
        mb={3}
        sx={{
          fontWeight: 700,
          letterSpacing: '0.5px',
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          pl: 2
        }}
      >
        My Favorites
      </Typography>
      
      <Divider sx={{ mb: 4, opacity: 0.3 }} />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
      ) : favorites.length > 0 ? (
        <Grid container spacing={3}>
          {favorites.map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item.media._id}>
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
                    image={getMediaUrl(item.media.posterUrl, 'poster')}
                    alt={item.media.title}
                    sx={{ 
                      borderRadius: '8px 8px 0 0',
                      transition: 'transform 0.3s ease'
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
                        onClick={() => handlePlayClick(item.media._id)}
                      >
                        Play
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<Info />}
                        onClick={() => handleDetailsClick(item.media._id)}
                        sx={{ borderColor: 'white', color: 'white' }}
                      >
                        Details
                      </Button>
                    </Box>
                    <Typography variant="body2" textAlign="center" sx={{ mb: 2 }}>
                      {item.media.plot?.substring(0, 100)}...
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {item.media.genres?.slice(0, 3).map((genre, idx) => (
                        <Box 
                          key={idx} 
                          sx={{ 
                            px: 1.5, 
                            py: 0.5, 
                            bgcolor: 'rgba(255,255,255,0.1)',
                            borderRadius: 1,
                            fontSize: '0.75rem'
                          }}
                        >
                          {genre}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  
                  {/* Remove from favorites button */}
                  <IconButton
                    size="small"
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'primary.main',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.7)'
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromFavorites(item.media._id);
                    }}
                  >
                    <Favorite />
                  </IconButton>
                </Box>
                
                <CardContent>
                  <Typography variant="h6" component="div" noWrap>
                    {item.media.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.media.year} • {item.media.type}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6">No favorites yet</Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Start adding movies and shows to your favorites
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

export default Favorites; 
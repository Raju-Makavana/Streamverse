import React, { useState, useEffect } from 'react';
import { 
  Box, 
  IconButton, 
  Typography, 
  useMediaQuery, 
  useTheme,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  MovieCreation, 
  PlayArrow, 
  Favorite, 
  FavoriteBorder, 
  Info, 
  AccessTime
} from '@mui/icons-material';
import { motion, AnimatePresence } from "framer-motion";
import { getMediaUrl } from '../config/getMediaUrl';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { getEnvConfig } from '../config/envConfig';

const url = getEnvConfig.get("backendURI");

const MediaSlider = ({ title, items = [], sx = {} }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [favoriteMediaIds, setFavoriteMediaIds] = useState([]);
  const [watchLaterMediaIds, setWatchLaterMediaIds] = useState([]);
  const [feedback, setFeedback] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Responsive itemsPerSlide based on screen size
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  const getItemsPerSlide = () => {
    if (isXsScreen) return 2;
    if (isSmScreen) return 3;
    if (isMdScreen) return 4;
    return 6; // Large screens
  };
  
  const itemsPerSlide = getItemsPerSlide();
  
  // Reset currentIndex when screen size changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerSlide]);

  // Fetch user's favorites and watch later lists
  useEffect(() => {
    if (isAuthenticated) {
      fetchUserLists();
    }
  }, [isAuthenticated]);

  const fetchUserLists = async () => {
    try {
      const [favoritesResponse, watchLaterResponse] = await Promise.all([
        axios.get(`${url}/user/favorites`, { withCredentials: true }),
        axios.get(`${url}/user/watch-later`, { withCredentials: true })
      ]);

      if (favoritesResponse.data.success) {
        setFavoriteMediaIds(favoritesResponse.data.data.map(item => item.media._id));
      }

      if (watchLaterResponse.data.success) {
        setWatchLaterMediaIds(watchLaterResponse.data.data.map(item => item.media._id));
      }
    } catch (error) {
      console.error('Error fetching user lists:', error);
    }
  };

  const nextSlide = () => {
    if (currentIndex < (items.length - itemsPerSlide)) {
      setCurrentIndex(currentIndex + itemsPerSlide);
    } else {
      // Loop back to the beginning if at the end
      setCurrentIndex(0);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - itemsPerSlide);
    } else {
      // Loop to the end if at the beginning
      setCurrentIndex(Math.max(0, items.length - itemsPerSlide));
    }
  };

  const canShowNext = items.length > itemsPerSlide;
  const canShowPrev = items.length > itemsPerSlide;

  const handleCardClick = (mediaId) => {
    navigate(`/media/${mediaId}`);
  };

  const handlePlayClick = (e, mediaId) => {
    e.stopPropagation();
    navigate(`/media/${mediaId}/watch`);
  };

  const handleInfoClick = (e, mediaId) => {
    e.stopPropagation();
    navigate(`/media/${mediaId}`);
  };

  const handleFavoriteToggle = async (e, mediaId) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setFeedback({
        open: true,
        message: 'Please login to add to favorites',
        severity: 'info'
      });
      return;
    }
    
    try {
      const isFavorite = favoriteMediaIds.includes(mediaId);
      const endpoint = isFavorite ? `${url}/user/favorites/remove` : `${url}/user/favorites/add`;
      
      const response = await axios.post(endpoint, { mediaId }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        if (isFavorite) {
          setFavoriteMediaIds(favoriteMediaIds.filter(id => id !== mediaId));
          setFeedback({
            open: true,
            message: 'Removed from favorites',
            severity: 'success'
          });
        } else {
          setFavoriteMediaIds([...favoriteMediaIds, mediaId]);
          setFeedback({
            open: true,
            message: 'Added to favorites',
            severity: 'success'
          });
        }
      } else {
        setFeedback({
          open: true,
          message: response.data.message || 'Action failed',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setFeedback({
        open: true,
        message: 'An error occurred',
        severity: 'error'
      });
    }
  };

  const handleWatchLaterToggle = async (e, mediaId) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      setFeedback({
        open: true,
        message: 'Please login to add to watch later',
        severity: 'info'
      });
      return;
    }
    
    try {
      const isInWatchLater = watchLaterMediaIds.includes(mediaId);
      const endpoint = isInWatchLater ? `${url}/user/watch-later/remove` : `${url}/user/watch-later/add`;
      
      const response = await axios.post(endpoint, { mediaId }, {
        withCredentials: true
      });
      
      if (response.data.success) {
        if (isInWatchLater) {
          setWatchLaterMediaIds(watchLaterMediaIds.filter(id => id !== mediaId));
          setFeedback({
            open: true,
            message: 'Removed from watch later',
            severity: 'success'
          });
        } else {
          setWatchLaterMediaIds([...watchLaterMediaIds, mediaId]);
          setFeedback({
            open: true,
            message: 'Added to watch later',
            severity: 'success'
          });
        }
      } else {
        setFeedback({
          open: true,
          message: response.data.message || 'Action failed',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error toggling watch later:', error);
      setFeedback({
        open: true,
        message: 'An error occurred',
        severity: 'error'
      });
    }
  };

  const closeFeedback = () => {
    setFeedback({ ...feedback, open: false });
  };

  // Empty state component
  const EmptyState = () => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
        bgcolor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 2,
        minHeight: '200px',
        width: '100%',
        maxWidth: '100%'
      }}
    >
      <MovieCreation sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
      <Typography variant="h6" color="grey.500" textAlign="center">
        No content available at the moment
      </Typography>
      <Typography variant="body2" color="grey.600" textAlign="center" sx={{ mt: 1 }}>
        Please check back later for updates
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ 
      mb: 6, 
      position: 'relative',
      width: '100%',
      maxWidth: '100%',
      overflow: 'visible',
      ...sx
    }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          fontWeight: 'bold', 
          color: 'white',
          pl: { xs: 2, sm: 4 }
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ 
        position: 'relative', 
        px: { xs: 2, sm: 4 },
        width: '100%',
        maxWidth: '100%',
        overflow: 'visible'
      }}>
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {canShowPrev && (
              <IconButton
                onClick={prevSlide}
                sx={{
                  position: 'absolute',
                  left: { xs: -5, sm: 0 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                }}
              >
                <ChevronLeft />
              </IconButton>
            )}

            <Box sx={{ 
              display: 'flex',
              overflow: 'hidden',
              width: '100%',
              maxWidth: '100%',
              pb: 5 // Add space for expanded cards
            }}>
              <Box sx={{
                display: 'flex',
                gap: 1,
                transition: 'transform 0.5s cubic-bezier(0.2, 0.9, 0.3, 1)',
                transform: `translateX(-${currentIndex * (100/itemsPerSlide)}%)`,
                width: '100%',
                maxWidth: '100%'
              }}>
                {items.map((item, index) => (
                  <Box
                    key={item._id || index}
                    component={motion.div}
                    initial={false}
                    whileHover={{ 
                      scale: 1.2, 
                      zIndex: 5,
                      transition: { duration: 0.3 } 
                    }}
                    onHoverStart={() => setHoveredIndex(index)}
                    onHoverEnd={() => setHoveredIndex(null)}
                    onClick={() => handleCardClick(item._id)}
                    sx={{
                      flex: `0 0 calc(${100/itemsPerSlide}% - 8px)`,
                      minWidth: `calc(${100/itemsPerSlide}% - 8px)`,
                      position: 'relative',
                      aspectRatio: '16/9',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      bgcolor: '#1a1a1a',
                      boxShadow: hoveredIndex === index ? '0 10px 20px rgba(0,0,0,0.4)' : 'none',
                      transition: 'box-shadow 0.3s ease',
                    }}
                  >
                    <Box
                      component="img"
                      src={getMediaUrl(item.posterUrl, 'poster') || getMediaUrl(item.thumbnailUrl, 'thumbnail')}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-poster.jpg';
                      }}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'all 0.3s ease'
                      }}
                    />
                    
                    <AnimatePresence>
                      {hoveredIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '30px 10px 10px',
                            background: 'linear-gradient(transparent, rgba(0,0,0,0.9) 40%)',
                            zIndex: 2
                          }}
                        >
                          <Typography variant="subtitle1" sx={{ 
                            fontWeight: 'bold',
                            marginBottom: '8px'
                          }}>
                            {item.title}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              sx={{ 
                                bgcolor: theme.palette.primary.main, 
                                color: 'white',
                                '&:hover': { bgcolor: theme.palette.primary.dark }
                              }}
                              onClick={(e) => handlePlayClick(e, item._id)}
                            >
                              <PlayArrow />
                            </IconButton>
                            
                            <IconButton 
                              size="small" 
                              sx={{ 
                                bgcolor: 'rgba(109, 109, 110, 0.7)', 
                                color: watchLaterMediaIds.includes(item._id) ? theme.palette.primary.main : 'white',
                                '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.9)' }
                              }}
                              onClick={(e) => handleWatchLaterToggle(e, item._id)}
                            >
                              <AccessTime />
                            </IconButton>
                            
                            <IconButton 
                              size="small" 
                              sx={{ 
                                bgcolor: 'rgba(109, 109, 110, 0.7)', 
                                color: favoriteMediaIds.includes(item._id) ? theme.palette.error.main : 'white',
                                '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.9)' }
                              }}
                              onClick={(e) => handleFavoriteToggle(e, item._id)}
                            >
                              {favoriteMediaIds.includes(item._id) ? <Favorite /> : <FavoriteBorder />}
                            </IconButton>
                            
                            <IconButton 
                              size="small" 
                              sx={{ 
                                bgcolor: 'rgba(109, 109, 110, 0.7)', 
                                color: 'white',
                                '&:hover': { bgcolor: 'rgba(109, 109, 110, 0.9)' }
                              }}
                              onClick={(e) => handleInfoClick(e, item._id)}
                            >
                              <Info />
                            </IconButton>
                            
                            {item.imdb?.rating && (
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 0.5,
                                ml: 'auto',
                                color: 'white'
                              }}>
                                <Star sx={{ fontSize: 16, color: 'yellow' }} />
                                <Typography variant="caption">
                                  {item.imdb.rating}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                          
                          {item.genre && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#ddd' }}>
                              {Array.isArray(item.genre) ? item.genre.join(', ') : item.genre}
                            </Typography>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Box>
                ))}
              </Box>
            </Box>

            {canShowNext && (
              <IconButton
                onClick={nextSlide}
                sx={{
                  position: 'absolute',
                  right: { xs: -5, sm: 0 },
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 10,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                }}
              >
                <ChevronRight />
              </IconButton>
            )}
          </>
        )}
      </Box>

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
    </Box>
  );
};

export default MediaSlider;
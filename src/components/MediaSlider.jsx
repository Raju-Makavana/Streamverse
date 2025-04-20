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
import styled from '@emotion/styled';

const url = getEnvConfig.get("backendURI");

// Add styled components for better organization and reusability
const SliderContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  overflow: 'hidden',
  padding: theme.spacing(4, 0),
  '&:hover .slider-nav': {
    opacity: 1,
  },
}));

const SliderTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 600,
  fontSize: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  color: theme.palette.common.white,
  '&::before': {
    content: '""',
    width: 4,
    height: 24,
    backgroundColor: theme.palette.primary.main,
    borderRadius: 2,
  },
}));

const SliderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  gap: theme.spacing(1),
  height: '320px',
}));

const SliderCard = styled(motion.div)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  cursor: 'pointer',
  height: '100%',
  minWidth: 'auto',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  '&:hover': {
    '& .card-overlay': {
      opacity: 1,
    },
    '& .card-content': {
      transform: 'translateY(0)',
    },
  },
}));

const CardImage = styled('img')({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  objectPosition: 'center top',
  display: 'block',
});

const CardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: theme.spacing(2),
}));

const CardActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  width: 36,
  height: 36,
}));

const CardContent = styled(Box)(({ theme }) => ({
  transform: 'translateY(100%)',
  transition: 'transform 0.3s ease',
  color: theme.palette.common.white,
}));

const SliderNavButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: theme.palette.common.white,
  zIndex: 2,
  opacity: 0,
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
  '&.Mui-disabled': {
    opacity: 0.5,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  '&.prev': {
    left: theme.spacing(2),
  },
  '&.next': {
    right: theme.spacing(2),
  },
}));

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
    <SliderContainer sx={sx}>
      <SliderTitle variant="h5">
        {title}
      </SliderTitle>
      
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <SliderWrapper
            sx={{
              transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)`
            }}
          >
            {items.map((item, index) => (
              <SliderCard
                key={item._id}
                onClick={() => handleCardClick(item._id)}
                whileHover={{ scale: 1.02 }}
                style={{ flex: `0 0 ${100 / itemsPerSlide}%`, margin: '0 4px' }}
              >
                <CardImage
                  src={getMediaUrl(item.posterUrl || item, 'poster')}
                  alt={item.title}
                  loading="lazy"
                />
                <CardOverlay className="card-overlay">
                  <CardActions>
                    <ActionButton
                      onClick={(e) => handlePlayClick(e, item._id)}
                      title="Play Now"
                    >
                      <PlayArrow />
                    </ActionButton>
                    <ActionButton
                      onClick={(e) => handleFavoriteToggle(e, item._id)}
                      title={favoriteMediaIds.includes(item._id) ? "Remove from Favorites" : "Add to Favorites"}
                    >
                      {favoriteMediaIds.includes(item._id) ? <Favorite /> : <FavoriteBorder />}
                    </ActionButton>
                    <ActionButton
                      onClick={(e) => handleWatchLaterToggle(e, item._id)}
                      title="Add to Watch Later"
                    >
                      <AccessTime />
                    </ActionButton>
                    <ActionButton
                      onClick={(e) => handleInfoClick(e, item._id)}
                      title="More Info"
                    >
                      <Info />
                    </ActionButton>
                  </CardActions>
                  <CardContent className="card-content">
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom noWrap>
                      {item.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      {item.imdb?.rating && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Star sx={{ color: '#ffd700', fontSize: '0.875rem', mr: 0.5 }} />
                          <Typography variant="body2">
                            {item.imdb.rating}
                          </Typography>
                        </Box>
                      )}
                      <Typography variant="body2">
                        {item.year}
                      </Typography>
                      <Typography variant="body2">
                        {item.runtime} min
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        opacity: 0.8
                      }}
                    >
                      {item.plot}
                    </Typography>
                  </CardContent>
                </CardOverlay>
              </SliderCard>
            ))}
          </SliderWrapper>

          {canShowPrev && (
            <SliderNavButton
              onClick={prevSlide}
              disabled={currentIndex === 0}
              className="slider-nav prev"
            >
              <ChevronLeft />
            </SliderNavButton>
          )}
          
          {canShowNext && (
            <SliderNavButton
              onClick={nextSlide}
              disabled={currentIndex >= items.length - itemsPerSlide}
              className="slider-nav next"
            >
              <ChevronRight />
            </SliderNavButton>
          )}
        </>
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
          variant="filled"
          sx={{
            width: '100%',
            boxShadow: (theme) => theme.shadows[3],
          }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </SliderContainer>
  );
};

export default MediaSlider;
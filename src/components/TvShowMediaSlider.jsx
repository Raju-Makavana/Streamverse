import { useState, useEffect } from 'react';
import { Box, IconButton, Typography, useMediaQuery, useTheme, Chip, Button } from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Tv, 
  Movie, 
  OndemandVideo, 
  Theaters,
  PlayArrow,
  Info
} from '@mui/icons-material';
import { motion } from "framer-motion";
import { getMediaUrl } from '../config/getMediaUrl';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { getEnvConfig } from '../config/envConfig';

const url = getEnvConfig.get("backendURI");

// Add styled components
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
  width: 40,
  height: 40,
  '&.prev': {
    left: theme.spacing(2),
  },
  '&.next': {
    right: theme.spacing(2),
  },
}));

const SliderContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  '&:hover .MuiIconButton-root': {
    opacity: 1,
  },
});

const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  minWidth: 'auto',
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

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
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const CardActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(1),
}));

const TvShowMediaSlider = ({ title }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Responsive itemsPerSlide based on screen size
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  useEffect(() => {
    fetchSliderData();
  }, []);

  const fetchSliderData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${url}/media/tvshows`);
      if (response.data.success) {
        setItems(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const getItemsPerSlide = () => {
    if (isXsScreen) return 2;
    if (isSmScreen) return 3;
    if (isMdScreen) return 4;
    return 5; // Large screens
  };
  
  const itemsPerSlide = getItemsPerSlide();
  
  // Reset currentIndex when screen size changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerSlide]);

  const nextSlide = () => {
    if (currentIndex < (items.length - itemsPerSlide)) {
      setCurrentIndex(currentIndex + itemsPerSlide);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - itemsPerSlide);
    }
  };

  const canShowNext = currentIndex + itemsPerSlide < items.length;
  const canShowPrev = currentIndex > 0;

  // Get appropriate TV show icon based on genre
  const getTvShowIcon = (item) => {
    if (!item.genres) return <Tv />;
    
    const genre = item.genres.find(g => 
      g.toLowerCase().includes('comedy') || 
      g.toLowerCase().includes('drama') || 
      g.toLowerCase().includes('thriller')
    );
    
    if (!genre) return <Tv />;
    
    if (genre.toLowerCase().includes('comedy')) return <Theaters />;
    if (genre.toLowerCase().includes('drama')) return <OndemandVideo />;
    if (genre.toLowerCase().includes('thriller')) return <Movie />;
    
    return <Tv />;
  };

  // Extract season number from title
  const getSeasonInfo = (title) => {
    const seasonMatch = title.match(/Season (\d+)/i) || title.match(/S(\d+)/i);
    if (seasonMatch) {
      return `S${seasonMatch[1]}`;
    }
    return null;
  };

  const handlePlayClick = (e, mediaId) => {
    e.stopPropagation();
    navigate(`/media/${mediaId}/watch`);
  };

  const handleInfoClick = (e, mediaId) => {
    e.stopPropagation();
    navigate(`/media/${mediaId}`);
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
      <Tv sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
      <Typography variant="h6" color="grey.500" textAlign="center">
        No TV shows available at the moment
      </Typography>
      <Typography variant="body2" color="grey.600" textAlign="center" sx={{ mt: 1 }}>
        Please check back later for updates
      </Typography>
    </Box>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Typography>Loading TV shows...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 6 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          fontWeight: 'bold', 
          color: 'white',
          pl: { xs: 1, sm: 2 },
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Tv />
        {title}
      </Typography>
      
      <SliderContainer>
        {items.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {canShowPrev && (
              <SliderNavButton
                onClick={prevSlide}
                className="prev"
                disableRipple
                disableTouchRipple
              >
                <ChevronLeft />
              </SliderNavButton>
            )}

            {canShowNext && (
              <SliderNavButton
                onClick={nextSlide}
                className="next"
                disableRipple
                disableTouchRipple
              >
                <ChevronRight />
              </SliderNavButton>
            )}

            <Box sx={{ 
              display: 'flex',
              gap: 2,
              overflow: 'hidden',
              width: '100%',
              maxWidth: '100%',
              px: { xs: 1, sm: 2 },
            }}>
              <Box sx={{
                display: 'flex',
                gap: 2,
                transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateX(-${currentIndex * (100/itemsPerSlide)}%)`,
                width: '100%',
                maxWidth: '100%'
              }}>
                {items.map((item, index) => (
                  <Box
                    key={item._id || index}
                    component={motion.div}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate(`/media/${item._id}`)}
                    sx={{
                      flex: `0 0 calc(${100/itemsPerSlide}% - 16px)`,
                      minWidth: `calc(${100/itemsPerSlide}% - 16px)`,
                      maxWidth: `calc(${100/itemsPerSlide}% - 16px)`,
                      position: 'relative',
                      aspectRatio: '2/3',
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      bgcolor: '#1a1a1a',
                      '&:hover .card-overlay': {
                        opacity: 1,
                      },
                    }}
                  >
                    <Box
                      component="img"
                      src={getMediaUrl(item.poster || item.posterUrl, 'poster')}
                      alt={item.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-poster.jpg';
                      }}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    
                    {/* Season and Genre chips */}
                    {getSeasonInfo(item.title) && (
                      <Chip
                        label={getSeasonInfo(item.title)}
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          zIndex: 1,
                        }}
                      />
                    )}
                    {item.genres && item.genres[0] && (
                      <Chip
                        label={item.genres[0]}
                        size="small"
                        icon={getTvShowIcon(item)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(0,0,0,0.7)',
                          color: 'white',
                          zIndex: 1,
                          '& .MuiChip-icon': {
                            color: 'white'
                          }
                        }}
                      />
                    )}

                    {/* Card Overlay with Action Buttons */}
                    <CardOverlay className="card-overlay">
                      <CardActions>
                        <ActionButton
                          onClick={(e) => handlePlayClick(e, item._id)}
                          title="Play Now"
                          disableRipple
                          disableTouchRipple
                          startIcon={<PlayArrow />}
                        >
                          Play Now
                        </ActionButton>
                        <ActionButton
                          onClick={(e) => handleInfoClick(e, item._id)}
                          title="More Info"
                          disableRipple
                          disableTouchRipple
                          startIcon={<Info />}
                        >
                          More Info
                        </ActionButton>
                      </CardActions>
                    </CardOverlay>

                    {/* Title and Rating */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 2,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.95) 40%)',
                      color: 'white',
                      zIndex: 1,
                    }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 'bold',
                          lineHeight: 1.2,
                          mb: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          height: '2.4em'
                        }}
                      >
                        {item.title.replace(/ - Season \d+/i, '').replace(/ Season \d+/i, '')}
                      </Typography>
                      
                      {item.plot && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            opacity: 0.7,
                            mb: 1,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '0.75rem',
                            lineHeight: 1.4
                          }}
                        >
                          {item.plot}
                        </Typography>
                      )}

                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        mt: 'auto'
                      }}>
                        {item.imdb?.rating && (
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 0.5 
                          }}>
                            <Star sx={{ fontSize: 16, color: 'yellow' }} />
                            <Typography variant="caption">
                              {item.imdb.rating}/10
                            </Typography>
                          </Box>
                        )}
                        <Typography variant="caption">
                          {item.year || (item.released && new Date(item.released).getFullYear())}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </>
        )}
      </SliderContainer>
    </Box>
  );
};

TvShowMediaSlider.propTypes = {
  title: PropTypes.string.isRequired
};

export default TvShowMediaSlider; 
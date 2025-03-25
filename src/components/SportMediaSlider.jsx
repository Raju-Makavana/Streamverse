import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { ChevronLeft, ChevronRight, Star, SportsEsports } from '@mui/icons-material';
import { motion } from "framer-motion";
import { getMediaUrl } from '../config/getMediaUrl';
import { useNavigate } from 'react-router-dom';

const SportsMediaSlider = ({ title, items = [] }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Responsive itemsPerSlide based on screen size
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmScreen = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isMdScreen = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
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
      <SportsEsports sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
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
      overflow: 'hidden'
    }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          fontWeight: 'bold', 
          color: 'white',
          pl: { xs: 1, sm: 2 }
        }}
      >
        {title}
      </Typography>
      
      <Box sx={{ 
        position: 'relative', 
        px: { xs: 1, sm: 2 },
        width: '100%',
        maxWidth: '100%'
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
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  }
                }}
              >
                <ChevronLeft />
              </IconButton>
            )}

            <Box sx={{ 
              display: 'flex',
              gap: 2,
              overflow: 'hidden',
              width: '100%',
              maxWidth: '100%'
            }}>
              <Box sx={{
                display: 'flex',
                gap: 2,
                transition: 'transform 0.3s ease-in-out',
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
                    }}
                  >
                    <Box
                      component="img"
                      src={getMediaUrl(item.posterUrl, 'poster')}
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
                    <Box sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      p: 1,
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                      color: 'white',
                    }}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.title}
                      </Typography>
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
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>

            {canShowNext && (
              <IconButton
                onClick={nextSlide}
                sx={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 2,
                  color: 'white',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.7)',
                  }
                }}
              >
                <ChevronRight />
              </IconButton>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SportsMediaSlider;
import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, PlayCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { getMediaUrl } from '../config/getMediaUrl';

import { getLatestTvShows, getPopularTvShows, getSlidersApi, getTrendingTvShows, getTvShowsByCategory } from '../apis/mediaApis';
import MediaSlider from '../components/MediaSlider';
import CustomLoader from '../components/CustomLoader';

export default function TVShows() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [sliders, setSliders] = useState([]);
  const [tvShowData, setTvShowData] = useState({
    latest: [],
    trending: [],
    popular: [],
    Drama: [],
    Comedy: [],
    Action: [],
    Documentary: []
  });

  useEffect(() => {
    fetchTvShowsData();
    fetchSliders();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || sliders.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, sliders.length]);

  const fetchSliders = async () => {
    try {
      const response = await getSlidersApi('tvshows');
      if (response?.data?.sliders && Array.isArray(response.data.sliders)) {
        setSliders(response.data.sliders);
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
    }
  };

  const fetchTvShowsData = async () => {
    try {
      setLoading(true);
      
      const [latestRes, trendingRes, popularRes, dramaRes, comedyRes, actionRes, documentaryRes] = 
        await Promise.all([
          getLatestTvShows(10),
          getTrendingTvShows(10),
          getPopularTvShows(10),
          // getTvShowsByCategory('Drama', 10),
          // getTvShowsByCategory('Comedy', 10),
          // getTvShowsByCategory('Action', 10),
          // getTvShowsByCategory('Documentary', 10)
        ]);

      setTvShowData({
        latest: latestRes.data || [],
        trending: trendingRes.data || [],
        popular: popularRes.data || [],
        // Drama: dramaRes.data || [],
        // Comedy: comedyRes.data || [],
        // Action: actionRes.data || [],
        // Documentary: documentaryRes.data || []
      });
    } catch (error) {
      console.error('Error fetching TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigateToMedia = (mediaId, mediaType) => {
    navigate(`/media/${mediaId}?type=${mediaType}`);
  };
  

  // Navigation handlers remain the same
  const nextSlide = () => {
    if (sliders.length <= 1) return;
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    if (sliders.length <= 1) return;
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  if (loading) {
    return <CustomLoader message="Loading TV shows for you..." />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      style={{ width: '100%', maxWidth: '100%', overflow: 'hidden' }}
    >
      {/* Hero Section */}
      <Box sx={{ position: 'relative', height: '80vh', width: '100%', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: 'absolute', width: '100%', height: '100%' }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                background: `linear-gradient(${
                  sliders[currentSlide]?.backgroundColor || "rgba(0,0,0,0.5)"
                }, rgba(0,0,0,0.8)), url(${
                  getMediaUrl(sliders[currentSlide], 'image') || ''
                })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                px: { xs: 2, md: 6 }
              }}
            >
              <Box sx={{ maxWidth: 600 }}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography variant="h2" component="h1" sx={{ mb: 3, color: 'white' }}>
                    {sliders[currentSlide]?.mediaId?.title || 'No Title'}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white', mb: 4, opacity: 0.9 }}>
                    {sliders[currentSlide]?.mediaId?.plot || 'No Description'}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<PlayCircle />}
                      onClick={() => navigateToMedia(sliders[currentSlide]?.mediaId?._id, sliders[currentSlide]?.mediaType)}
                      sx={{ px: 4 }}
                    >
                      Watch Now
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Info />}
                      onClick={() => navigateToMedia(sliders[currentSlide]?.mediaId?._id, sliders[currentSlide]?.mediaType)}
                      sx={{ px: 4, color: "white", borderColor: "white" }}
                    >
                      More Info
                    </Button>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {sliders.length > 1 && (
          <>
            <IconButton
              onClick={prevSlide}
              sx={{
                position: 'absolute',
                left: { xs: 10, md: 20 },
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                zIndex: 2
              }}
            >
              <ChevronLeft fontSize="large" />
            </IconButton>
            <IconButton
              onClick={nextSlide}
              sx={{
                position: 'absolute',
                right: { xs: 10, md: 20 },
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                zIndex: 2
              }}
            >
              <ChevronRight fontSize="large" />
            </IconButton>
          </>
        )}
      </Box>

      {/* TV Show Categories */}
      <Box sx={{ 
        py: 4, 
        px: { xs: 2, sm: 3, md: 4 },
        width: '100%',
        maxWidth: '100%',
        overflow: 'hidden'
      }}>
        <MediaSlider
          title="Trending TV Shows"
          items={tvShowData.trending}
          itemsPerSlide={5}
        />
        
        <MediaSlider
          title="Latest TV Shows"
          items={tvShowData.latest}
          itemsPerSlide={5}
        />
        
        <MediaSlider
          title="Popular TV Shows"
          items={tvShowData.popular}
          itemsPerSlide={5}
        />
        
        <MediaSlider
          title="Drama Series"
          items={tvShowData.Drama}
          itemsPerSlide={5}
        />
        
        <MediaSlider
          title="Comedy Series"
          items={tvShowData.Comedy}
          itemsPerSlide={5}
        />
        
        <MediaSlider
          title="Action Series"
          items={tvShowData.Action}
          itemsPerSlide={5}
        />
        
        <MediaSlider
          title="Documentary Series"
          items={tvShowData.Documentary}
          itemsPerSlide={5}
        />
      </Box>
    </motion.div>
  );
}
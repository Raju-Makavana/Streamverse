import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Button, Alert, Chip, Grid } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Info, PlayCircle, LiveTv, Article, Refresh, NewspaperOutlined } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import { getMediaUrl } from '../config/getMediaUrl';
import MediaSlider from '../components/MediaSlider';
import CustomLoader from '../components/CustomLoader';
import { getBreakingNews, getLatestNews, getNewsByCategory, getSlidersApi } from '../apis/mediaApis';
import NewsCard from '../components/NewsCard';

export default function News() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [newsData, setNewsData] = useState({
    breaking: [],
    latest: [],
    popular: [],
    politics: [],
    business: [],
    technology: [],
    entertainment: []
  });

  useEffect(() => {
    fetchNewsData();
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
      const response = await getSlidersApi('news');
      if (response?.data?.sliders && Array.isArray(response.data.sliders)) {
        setSliders(response.data.sliders);
      } else {
        console.error("Response structure is not as expected:", response);
        setSliders([]);
      }
    } catch (error) {
      console.error('Error fetching sliders:', error);
      setError("Failed to load featured news");
    }
  };

  const fetchNewsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [breakingRes, latestRes, popularRes] = await Promise.all([
        getBreakingNews(),
        getLatestNews(),
        // getPopularNews()
      ]);

      if (!breakingRes.success) throw new Error("Failed to load breaking news");
      if (!latestRes.success) throw new Error("Failed to load latest news");
      // if (!popularRes.success) throw new Error("Failed to load popular news");

      setNewsData({
        breaking: breakingRes.data || [],
        latest: latestRes.data || [],
        // popular: popularRes.data || []
      });

      // Fetch category-specific news
      const categoryData = await Promise.all(
        ['Politics', 'Business', 'Technology', 'Entertainment'].map(category =>
          getNewsByCategory(category)
        )
      );

      const categorizedData = categoryData.reduce((acc, res, index) => {
        const category = ['politics', 'business', 'technology', 'entertainment'][index];
        acc[category] = res.success ? res.data : [];
        return acc;
      }, {});

      setNewsData(prev => ({ ...prev, ...categorizedData }));
    } catch (error) {
      console.error('Error fetching news data:', error);
      setError(error.message || "Failed to load news content");
    } finally {
      setLoading(false);
    }
  };

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

  // Empty state component
  const EmptyState = ({ message = "No content available" }) => (
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
      <NewspaperOutlined sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
      <Typography variant="h6" color="grey.500" textAlign="center">
        {message}
      </Typography>
      <Typography variant="body2" color="grey.600" textAlign="center" sx={{ mt: 1 }}>
        Please check back later for updates
      </Typography>
    </Box>
  );

  if (loading) {
    return <CustomLoader message="Loading news content..." />;
  }

  if (error) {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          gap: 3,
          px: 2
        }}
      >
        <Alert 
          severity="error" 
          sx={{ 
            maxWidth: 'sm',
            width: '100%'
          }}
        >
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => {
            fetchNewsData();
            fetchSliders();
          }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: '100%', maxWidth: '100%', minHeight: '100vh' }}
    >
      {/* Banner/Hero Section */}
      <Box sx={{ position: 'relative', height: '80vh', overflow: 'hidden', width: '100%', maxWidth: '100%' }}>
        <AnimatePresence mode="wait">
          {sliders.length > 0 ? (
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%'
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(${
                    sliders[currentSlide]?.backgroundColor || "rgba(0,0,0,0.3)"
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Chip label="FEATURED" color="primary" size="small" icon={<Article />} />
                      <Typography variant="subtitle1" color="primary.main">
                        Top Story
                      </Typography>
                    </Box>
                    <Typography variant="h2" component="h1" sx={{ mb: 2, color: 'white' }}>
                      {sliders[currentSlide]?.mediaId?.title || 'No Title'}
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'white', mb: 4, opacity: 0.9 }}>
                      {sliders[currentSlide]?.description || 'No Description'}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant="contained"
                        startIcon={<Article />}
                        onClick={() => navigate(`/media/${sliders[currentSlide]?.mediaId?._id}`)}
                      >
                        Watch Now
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Info />}
                        sx={{ 
                          borderColor: 'white', 
                          color: 'white',
                          '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                        }}
                        onClick={() => navigate(`/media/${sliders[currentSlide]?.mediaId?._id}`)}
                      >
                        More Info
                      </Button>
                    </Box>
                  </motion.div>
                </Box>
              </Box>
            </motion.div>
          ) : (
            <Box
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.9)',
                px: { xs: 2, md: 6 }
              }}
            >
              <Typography variant="h4" color="grey.500" textAlign="center">
                Featured news content coming soon
              </Typography>
            </Box>
          )}
        </AnimatePresence>

        {/* Banner Navigation Controls */}
        {sliders.length > 1 && (
          <>
            <IconButton
              onClick={prevSlide}
              sx={{
                position: 'absolute',
                left: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                color: 'white'
              }}
            >
              <ChevronLeft />
            </IconButton>
            
            <IconButton
              onClick={nextSlide}
              sx={{
                position: 'absolute',
                right: 20,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(0,0,0,0.5)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                color: 'white'
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
      </Box>

      {/* News Categories */}
      <Box sx={{ 
        mt: 4, 
        px: { xs: 2, md: 6 },
        width: '100%',
        maxWidth: '100%'
      }}>
        {/* Breaking News */}
        <Box sx={{ mb: 6, width: '100%', maxWidth: '100%' }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}>
            Breaking News
          </Typography>
          {newsData.breaking.length > 0 ? (
            <Grid container spacing={3} sx={{ width: '100%', maxWidth: '100%', m: 0 }}>
              {newsData.breaking.map((news, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={news._id || index}>
                  <NewsCard news={news} isBreaking={true} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <EmptyState message="No breaking news at the moment" />
          )}
        </Box>

        {/* Latest News */}
        <Box sx={{ mb: 6, width: '100%', maxWidth: '100%' }}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}>
            Latest News
          </Typography>
          {newsData.latest.length > 0 ? (
            <Grid container spacing={3} sx={{ width: '100%', maxWidth: '100%', m: 0 }}>
              {newsData.latest.map((news, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={news._id || index}>
                  <NewsCard news={news} isBreaking={false} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <EmptyState message="No latest news available" />
          )}
        </Box>

        {/* Popular News */}
        <Box sx={{ width: '100%', maxWidth: '100%' }}>
          <MediaSlider title="Trending News" items={newsData.popular} />
        </Box>

        {/* Category-specific content */}
        {newsData.politics.length > 0 && (
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <MediaSlider title="Politics" items={newsData.politics} />
          </Box>
        )}
        {newsData.business.length > 0 && (
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <MediaSlider title="Business" items={newsData.business} />
          </Box>
        )}
        {newsData.technology.length > 0 && (
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <MediaSlider title="Technology" items={newsData.technology} />
          </Box>
        )}
        {newsData.entertainment.length > 0 && (
          <Box sx={{ width: '100%', maxWidth: '100%' }}>
            <MediaSlider title="Entertainment" items={newsData.entertainment} />
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
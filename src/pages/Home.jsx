import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  CircularProgress,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  PlayArrow,
  Add,
  VolumeOff,
  VolumeUp
} from "@mui/icons-material";
import {
  getAllMediaApi,
  getFeaturedMedia,
  getLatestMedia,
  getPopularMedia,
  getSlidersApi,
  getTrendingMedia,
} from "../apis/mediaApis";
import { getMediaUrl } from "../config/getMediaUrl";
import { Link, useNavigate } from "react-router-dom";
import MediaSlider from "../components/MediaSlider";
import CustomLoader from "../components/CustomLoader";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sliders, setSliders] = useState([]);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const [mediaData, setMediaData] = useState({
    latest: [],
    trending: [],
    popular: [],
    featured: [],
    sports: [],
    news: [],
    originals: []
  });

  useEffect(() => {
    fetchMovies();
    fetchSliders();
  }, []);

  useEffect(() => {
    fetchAllMedia();
  }, []);

  const fetchAllMedia = async () => {
    try {
      setLoading(true);
      const [latestRes, trendingRes, popularRes, featuredRes] = await Promise.all([
        getLatestMedia(),
        getTrendingMedia(),
        getPopularMedia(),
        getFeaturedMedia()
      ]);

      setMediaData({
        latest: latestRes?.data || [],
        trending: trendingRes?.data || [],
        popular: popularRes?.data || [],
        featured: featuredRes?.data || [],
        sports: popularRes?.data?.filter(item => item.type === 'sports') || [],
        news: popularRes?.data?.filter(item => item.type === 'news') || [],
        originals: featuredRes?.data?.filter(item => item.isOriginal) || []
      });
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSliders = async () => {
    try {
      setLoading(true);
      const response = await getSlidersApi('home');

      // Access the nested sliders array
      if (response?.data?.sliders && Array.isArray(response.data.sliders)) {
        const activeSliders = response.data.sliders;
        setSliders(activeSliders);
      } else {
        console.error("Response structure is not as expected:", response);
        setSliders([]); // Set empty array as fallback
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
      setSliders([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await getAllMediaApi();
      if (response && response.success) {
        setMovies(response.data);
      } else {
        console.error("Failed to fetch movies:", response?.error);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAutoPlaying || sliders.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, sliders.length]);

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

  if(loading){
    return <CustomLoader />;
  }

  const handlePlayClick = (mediaId) => {
    navigate(`/media/${mediaId}/watch`);
  };

  const handleDetailsClick = (mediaId) => {
    navigate(`/media/${mediaId}`);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  // Get current featured item
  const currentSlider = sliders[currentSlide] || {};
  const mediaId = currentSlider?.mediaId?._id;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-[#141414] min-h-screen overflow-x-hidden"
    >
      {/* Hero Banner Section */}
      <Box 
        className="relative w-full" 
        sx={{ 
          height: { xs: '60vh', sm: '70vh', md: '85vh' },
          marginBottom: { xs: 4, md: 0 } 
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 w-full h-full"
          >
            {/* Hero image or video */}
            <Box
              className="relative w-full h-full"
              sx={{
                '&:after': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  backgroundImage: 'linear-gradient(to top, #141414 0%, rgba(20,20,20,0.7) 50%, rgba(20,20,20,0.4) 100%)',
                  zIndex: 1
                }
              }}
            >
              {currentSlider?.videoUrl ? (
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted={isMuted}
                  poster={getMediaUrl(currentSlider, "image")}
                  className="w-full h-full object-cover"
                >
                  <source src={currentSlider.videoUrl} type="video/mp4" />
                </video>
              ) : (
                <img 
                  src={getMediaUrl(currentSlider, "image")} 
                  alt={currentSlider?.mediaId?.title || "Featured Content"}
                  className="w-full h-full object-cover"
                />
              )}
              
              {/* Content overlay */}
              <Box 
                className="absolute inset-0 flex flex-col justify-center z-10"
                sx={{ 
                  padding: { xs: '0 1rem', sm: '0 2rem', md: '0 4rem' },
                  top: { xs: '10%', md: '25%' } 
                }}
              >
                <Box sx={{ maxWidth: { xs: '100%', md: '40%' }}}>
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.7 }}
                  >
                    <Typography 
                      variant="h2" 
                      component="h1"
                      sx={{ 
                        fontWeight: 700,
                        fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        mb: 2
                      }}
                    >
                      {currentSlider?.mediaId?.title || "Discover Amazing Content"}
                    </Typography>
                    
                    {!isMobile && (
                      <Typography 
                        variant="h6"
                        sx={{ 
                          mb: 3, 
                          textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
                          opacity: 0.9,
                          maxWidth: '90%'
                        }}
                      >
                        {currentSlider?.description || currentSlider?.mediaId?.description || "Explore the best streaming experience"}
                      </Typography>
                    )}
                    
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        gap: 2,
                        mt: { xs: 2, md: 3 }
                      }}
                    >
                      {mediaId && (
                        <>
                          <Button
                            variant="contained"
                            startIcon={<PlayArrow />}
                            onClick={() => handlePlayClick(mediaId)}
                            sx={{
                              bgcolor: 'primary.main',
                              color: 'white',
                              fontWeight: 600,
                              px: { xs: 2, md: 4 },
                              py: { xs: 1, md: 1.3 },
                              '&:hover': {
                                bgcolor: 'primary.dark',
                              },
                              fontSize: { xs: '0.85rem', md: '1rem' }
                            }}
                          >
                            Play
                          </Button>
                          
                          <Button
                            variant="contained"
                            startIcon={<Info />}
                            onClick={() => handleDetailsClick(mediaId)}
                            sx={{
                              bgcolor: 'rgba(109, 109, 110, 0.7)',
                              color: 'white',
                              fontWeight: 600,
                              px: { xs: 2, md: 4 },
                              py: { xs: 1, md: 1.3 },
                              '&:hover': {
                                bgcolor: 'rgba(109, 109, 110, 0.5)',
                              },
                              fontSize: { xs: '0.85rem', md: '1rem' }
                            }}
                          >
                            More Info
                          </Button>
                        </>
                      )}
                    </Box>
                  </motion.div>
                </Box>
              </Box>
              
              {/* Mute/Unmute button */}
              {currentSlider?.videoUrl && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: { xs: 10, md: 100 }, 
                    right: { xs: 10, md: 50 },
                    zIndex: 2 
                  }}
                >
                  <IconButton 
                    onClick={toggleMute}
                    sx={{ 
                      bgcolor: 'rgba(0,0,0,0.5)', 
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' }
                    }}
                  >
                    {isMuted ? <VolumeOff /> : <VolumeUp />}
                  </IconButton>
                </Box>
              )}
              
              {/* Navigation arrows */}
              {sliders.length > 1 && (
                <>
                  <IconButton
                    onClick={prevSlide}
                    sx={{
                      position: 'absolute',
                      left: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      zIndex: 2,
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                      display: { xs: 'none', md: 'flex' }
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  <IconButton
                    onClick={nextSlide}
                    sx={{
                      position: 'absolute',
                      right: 10,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      zIndex: 2,
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                      display: { xs: 'none', md: 'flex' }
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </>
              )}
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Content Section */}
      <Box sx={{ mt: { xs: -8, sm: -12, md: -20 }, position: 'relative', zIndex: 5 }}>
        {mediaData.trending.length > 0 && (
          <MediaSlider
            title="Trending Now"
            items={mediaData.trending}
            sx={{ mb: 4 }}
          />
        )}
        
        {mediaData.originals?.length > 0 && (
          <MediaSlider
            title="StreamVerse Originals"
            items={mediaData.originals}
            sx={{ mb: 4 }}
          />
        )}
        
        {mediaData.latest.length > 0 && (
          <MediaSlider
            title="New Releases"
            items={mediaData.latest}
            sx={{ mb: 4 }}
          />
        )}
        
        {mediaData.popular.length > 0 && (
          <MediaSlider
            title="Popular on StreamVerse"
            items={mediaData.popular}
            sx={{ mb: 4 }}
          />
        )}
        
        {mediaData.sports?.length > 0 && (
          <MediaSlider
            title="Sports"
            items={mediaData.sports}
            sx={{ mb: 4 }}
          />
        )}
        
        {mediaData.news?.length > 0 && (
          <MediaSlider
            title="News & Documentaries"
            items={mediaData.news}
            sx={{ mb: 4 }}
          />
        )}
      </Box>
    </motion.div>
  );
}

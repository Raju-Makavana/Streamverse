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
import { styled } from '@mui/material/styles';

// Add styled components for better organization
const HeroSection = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '85vh',
  [theme.breakpoints.down('md')]: {
    height: '70vh',
  },
  [theme.breakpoints.down('sm')]: {
    height: '60vh',
  },
  marginBottom: theme.spacing(4),
  overflow: 'hidden',
}));

const HeroOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)',
  zIndex: 1,
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  zIndex: 2,
  padding: theme.spacing(0, 4),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0, 2),
  },
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginBottom: theme.spacing(2),
  fontSize: '3.5rem',
  [theme.breakpoints.down('md')]: {
    fontSize: '3rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
  color: theme.palette.common.white,
  textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
}));

const HeroDescription = styled(Typography)(({ theme }) => ({
  fontSize: '1.1rem',
  marginBottom: theme.spacing(4),
  maxWidth: '600px',
  color: theme.palette.common.white,
  textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const HeroActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
}));

const PlayButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 3),
    fontSize: '1rem',
  },
}));

const InfoButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'rgba(109, 109, 110, 0.7)',
  color: theme.palette.common.white,
  padding: theme.spacing(1.5, 4),
  fontSize: '1.1rem',
  fontWeight: 600,
  '&:hover': {
    backgroundColor: 'rgba(109, 109, 110, 0.9)',
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 3),
    fontSize: '1rem',
  },
}));

const SliderNavButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(0,0,0,0.5)',
  color: theme.palette.common.white,
  zIndex: 3,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
  '&.prev': {
    left: theme.spacing(2),
  },
  '&.next': {
    right: theme.spacing(2),
  },
}));

const VolumeButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(4),
  right: theme.spacing(4),
  backgroundColor: 'rgba(0,0,0,0.5)',
  color: theme.palette.common.white,
  zIndex: 3,
  '&:hover': {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
}));

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
      style={{ 
        backgroundColor: '#141414',
        minHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      {/* Hero Section */}
      <HeroSection>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {currentSlider?.videoUrl ? (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted={isMuted}
                poster={getMediaUrl(currentSlider, "image")}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              >
                <source src={currentSlider.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <Box
                component="img"
                src={getMediaUrl(currentSlider, "image")}
                alt={currentSlider?.mediaId?.title || "Featured Content"}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
            
            <HeroOverlay />
            
            <HeroContent>
              <Box sx={{ maxWidth: { xs: '100%', md: '50%' } }}>
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.7 }}
                >
                  <HeroTitle variant="h1">
                    {currentSlider?.mediaId?.title}
                  </HeroTitle>
                  
                  <HeroDescription variant="body1">
                    {currentSlider?.mediaId?.plot}
                  </HeroDescription>
                  
                  <HeroActions>
                    <PlayButton
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={() => handlePlayClick(mediaId)}
                    >
                      Play Now
                    </PlayButton>
                    
                    <InfoButton
                      variant="contained"
                      startIcon={<Info />}
                      onClick={() => handleDetailsClick(mediaId)}
                    >
                      More Info
                    </InfoButton>
                  </HeroActions>
                </motion.div>
              </Box>
            </HeroContent>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        {sliders.length > 1 && (
          <>
            <SliderNavButton
              onClick={prevSlide}
              className="prev"
              aria-label="Previous slide"
            >
              <ChevronLeft />
            </SliderNavButton>
            
            <SliderNavButton
              onClick={nextSlide}
              className="next"
              aria-label="Next slide"
            >
              <ChevronRight />
            </SliderNavButton>
          </>
        )}

        {/* Volume Control */}
        {currentSlider?.videoUrl && (
          <VolumeButton
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeOff /> : <VolumeUp />}
          </VolumeButton>
        )}
      </HeroSection>

      {/* Content Sections */}
      <Box sx={{ px: { xs: 2, sm: 4 }, pb: 6 }}>
        {mediaData.featured.length > 0 && (
          <MediaSlider
            title="Featured"
            items={mediaData.featured}
            sx={{ mb: 4 }}
          />
        )}
        
        {mediaData.trending.length > 0 && (
          <MediaSlider
            title="Trending Now"
            items={mediaData.trending}
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
            title="Popular on Streamverse"
            items={mediaData.popular}
            sx={{ mb: 4 }}
          />
        )}
        
        {mediaData.originals.length > 0 && (
          <MediaSlider
            title="Streamverse Originals"
            items={mediaData.originals}
            sx={{ mb: 4 }}
          />
        )}
        
        {mediaData.sports.length > 0 && (
          <MediaSlider
            title="Sports"
            items={mediaData.sports}
            sx={{ mb: 4 }}
          />
        )}
        
        {mediaData.news.length > 0 && (
          <MediaSlider
            title="News"
            items={mediaData.news}
            sx={{ mb: 4 }}
          />
        )}
      </Box>
    </motion.div>
  );
}

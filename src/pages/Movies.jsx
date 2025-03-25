import { useState, useEffect } from "react";
import { Box, Typography, IconButton, Button, Alert } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  PlayCircle,
  Refresh,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

// Import components
import { getMediaUrl } from "../config/getMediaUrl";
import {
  getFeaturedMoviesApi,
  getLatestMoviesApi,
  getMoviesByGenreApi,
  getPopularMoviesApi,
  getSlidersApi,
  getTrendingMoviesApi,
} from "../apis/mediaApis";
import MediaSlider from "../components/MediaSlider";
import CustomLoader from "../components/CustomLoader";

export default function Movies() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [movieCategories, setMovieCategories] = useState({
    latest: [],
    trending: [],
    popular: [],
    action: [],
    comedy: [],
    drama: [],
  });

  // Fetch all data on component mount
  useEffect(() => {
    fetchMoviesData();
    fetchMovieSliders();
  }, []);

  const fetchMovieSliders = async () => {
    try {
      const response = await getSlidersApi("movies");
      if (response?.data?.sliders && Array.isArray(response.data.sliders)) {
        setSliders(response.data.sliders);
      } else {
        console.error("Response structure is not as expected:", response);
        setSliders([]);
      }
    } catch (error) {
      console.error("Error fetching movie sliders:", error);
      setSliders([]);
      setError("Failed to load featured movies");
    }
  };

  // Auto-play banner slides
  useEffect(() => {
    if (!isAutoPlaying || sliders.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, sliders.length]);

  // Banner navigation handlers
  const nextSlide = () => {
    if (sliders.length <= 1) return;
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    if (sliders.length <= 1) return;
    setIsAutoPlaying(false);
    setCurrentSlide(
      (prev) => (prev - 1 + sliders.length) % sliders.length
    );
  };

  // Fetch all movies data
  const fetchMoviesData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all movie categories in parallel
      const [latestResponse, trendingResponse] = await Promise.all([
        getLatestMoviesApi(1, 10),
        getTrendingMoviesApi(7, 10),
      ]);

      // Check for errors in responses
      if (!latestResponse.success)
        throw new Error("Failed to load latest movies");
      if (!trendingResponse.success)
        throw new Error("Failed to load trending movies");

      // Update state with fetched data
      setMovieCategories({
        latest: latestResponse.data,
        trending: trendingResponse.data,
      });
    } catch (error) {
      console.error("Error fetching movies data:", error);
      setError(error.message || "Failed to load movies");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to movie details
  const navigateToMovie = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  // Loading state with animation
  if (loading) {
    return <CustomLoader message="Loading amazing movies for you..." />;
  }

  // Error state with retry button
  if (error) {
    return (
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          gap: 3,
          px: 2,
        }}
      >
        <Alert
          severity="error"
          sx={{
            maxWidth: "sm",
            width: "100%",
          }}
        >
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => {
            fetchMoviesData();
            fetchMovieSliders();
          }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  // Show message if no sliders are available
  if (!loading && sliders.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Typography variant="h5" color="white">
          No slider content available
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ width: "100%", maxWidth: "100%", overflow: "hidden", minHeight: "100vh" }}
    >
      {/* Banner/Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: "80vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
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
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{ mb: 3, color: "white" }}
                  >
                    {sliders[currentSlide]?.mediaId?.title || sliders[currentSlide]?.title || "No Title"}
                  </Typography>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: "white", 
                      mb: 4,
                      display: { xs: "-webkit-box" },
                      WebkitLineClamp: { xs: 2, sm: 3, md: 4 },
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      textShadow: "1px 1px 2px rgba(0,0,0,0.7)",
                    }}
                  >
                    {sliders[currentSlide]?.description || sliders[currentSlide]?.overview || "No Description"}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PlayCircle />}
                      onClick={() => navigateToMovie(sliders[currentSlide]?.id || sliders[currentSlide]?.mediaId?._id)}
                      sx={{
                        fontWeight: "bold",
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1, sm: 1.5 },
                      }}
                    >
                      Watch Now
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Info />}
                      onClick={() => navigateToMovie(sliders[currentSlide]?.id || sliders[currentSlide]?.mediaId?._id)}
                      sx={{
                        borderColor: "white",
                        color: "white",
                        "&:hover": {
                          borderColor: "white",
                          backgroundColor: "rgba(255,255,255,0.1)",
                        },
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1, sm: 1.5 },
                      }}
                    >
                      More Info
                    </Button>
                  </Box>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
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
              <ChevronLeft fontSize="large" />
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
              <ChevronRight fontSize="large" />
            </IconButton>

            {/* Slide Indicators */}
            <Box
              sx={{
                position: "absolute",
                bottom: 20,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 1,
              }}
            >
              {sliders.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor:
                      index === currentSlide
                        ? "white"
                        : "rgba(255,255,255,0.5)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentSlide(index);
                  }}
                />
              ))}
            </Box>
          </>
        )}
      </Box>

      {/* Movie Categories */}
      <Box
        sx={{
          py: 4,
          px: { xs: 2, sm: 3, md: 4 },
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <MediaSlider 
          title="Latest Movies" 
          items={movieCategories.latest} 
          itemsPerSlide={5}
        />
        <MediaSlider 
          title="Trending Now" 
          items={movieCategories.trending} 
          itemsPerSlide={5}
        />
      </Box>
    </motion.div>
  );
}
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
  getLatestMoviesApi,
  getTrendingMoviesApi,
  getSlidersApi,
  getLatestTvShows,
  getTrendingTvShows,
} from "../apis/mediaApis";
import MediaSlider from "../components/MediaSlider";
import CustomLoader from "../components/CustomLoader";

export default function Home() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [content, setContent] = useState({
    latestMovies: [],
    trendingMovies: [],
    latestShows: [],
    trendingShows: [],
  });

  // Fetch all data on component mount
  useEffect(() => {
    fetchHomeData();
    fetchHomeSliders();
  }, []);

  const fetchHomeSliders = async () => {
    try {
      const response = await getSlidersApi("home");
      if (response?.data?.sliders && Array.isArray(response.data.sliders)) {
        setSliders(response.data.sliders);
      } else {
        console.error("Response structure is not as expected:", response);
        setSliders([]);
      }
    } catch (error) {
      console.error("Error fetching featured sliders:", error);
      setSliders([]);
      setError("Failed to load featured content");
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
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  // Fetch all content data
  const fetchHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all content categories in parallel
      const [
        latestMoviesResponse,
        trendingMoviesResponse,
        latestShowsResponse,
        trendingShowsResponse,
      ] = await Promise.all([
        getLatestMoviesApi(1, 10),
        getTrendingMoviesApi(7, 10),
        getLatestTvShows(1, 10),
        getTrendingTvShows(7, 10),
      ]);

      // Check for errors in responses
      if (!latestMoviesResponse.success) throw new Error("Failed to load latest movies");
      if (!trendingMoviesResponse.success) throw new Error("Failed to load trending movies");
      if (!latestShowsResponse.success) throw new Error("Failed to load latest shows");
      if (!trendingShowsResponse.success) throw new Error("Failed to load trending shows");

      // Update state with fetched data
      setContent({
        latestMovies: latestMoviesResponse.data,
        trendingMovies: trendingMoviesResponse.data,
        latestShows: latestShowsResponse.data,
        trendingShows: trendingShowsResponse.data,
      });
    } catch (error) {
      console.error("Error fetching home data:", error);
      setError(error.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to media details
  const navigateToMedia = (mediaId, mediaType) => {
    navigate(`/media/${mediaId}?type=${mediaType}`);
  };

  // Loading state with animation
  if (loading) {
    return <CustomLoader message="Loading amazing content for you..." />;
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
        <Alert severity="error" sx={{ maxWidth: "sm", width: "100%" }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={() => {
            fetchHomeData();
            fetchHomeSliders();
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
      style={{ width: "100%", maxWidth: "100%", overflow: "hidden", minHeight: "100vh" }}
    >
      {/* Hero Section */}
      <Box sx={{ position: "relative", height: "80vh", width: "100%", overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{ position: "absolute", width: "100%", height: "100%" }}
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
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                px: { xs: 2, md: 6 },
              }}
            >
              <Box sx={{ maxWidth: 600 }}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography variant="h2" component="h1" sx={{ mb: 3, color: "white" }}>
                    {sliders[currentSlide]?.mediaId?.title || sliders[currentSlide]?.title || "Welcome to StreamVerse"}
                  </Typography>
                  <Typography variant="h5" sx={{ mb: 4, color: "rgba(255, 255, 255, 0.8)" }}>
                    {sliders[currentSlide]?.mediaId?.overview || sliders[currentSlide]?.description || 
                    "Discover the best movies and TV shows all in one place"}
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

        {/* Slider Navigation */}
        {sliders.length > 1 && (
          <>
            <IconButton
              onClick={prevSlide}
              sx={{
                position: "absolute",
                left: { xs: 8, md: 20 },
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={nextSlide}
              sx={{
                position: "absolute",
                right: { xs: 8, md: 20 },
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
                bgcolor: "rgba(0,0,0,0.5)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
              }}
            >
              <ChevronRight />
            </IconButton>
          </>
        )}
      </Box>

      {/* Content Sections */}
      <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
        {/* Latest Movies */}
        {content.latestMovies.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 3, color: "white" }}>
              Latest Movies
            </Typography>
            <MediaSlider items={content.latestMovies} onItemClick={(id) => navigateToMedia(id, 'movie')} />
          </Box>
        )}

        {/* Trending Movies */}
        {content.trendingMovies.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 3, color: "white" }}>
              Trending Movies
            </Typography>
            <MediaSlider items={content.trendingMovies} onItemClick={(id) => navigateToMedia(id, 'movie')} />
          </Box>
        )}

        {/* Latest TV Shows */}
        {content.latestShows.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 3, color: "white" }}>
              Latest TV Shows
            </Typography>
            <MediaSlider items={content.latestShows} onItemClick={(id) => navigateToMedia(id, 'tv')} />
          </Box>
        )}

        {/* Trending TV Shows */}
        {content.trendingShows.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ mb: 3, color: "white" }}>
              Trending TV Shows
            </Typography>
            <MediaSlider items={content.trendingShows} onItemClick={(id) => navigateToMedia(id, 'tv')} />
          </Box>
        )}
      </Box>
    </motion.div>
  );
}

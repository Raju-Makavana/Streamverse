import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Alert,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  PlayCircle,
  LiveTv,
  Schedule,
  Refresh,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { getMediaUrl } from "../config/getMediaUrl";
import MediaSlider from "../components/MediaSlider";
import CustomLoader from "../components/CustomLoader";
import {
  getLiveSports,
  getPopularSports,
  getSlidersApi,
  getSportsByCategory,
  getUpcomingSports,
} from "../apis/mediaApis";
import SportsMediaSlider from "../components/SportMediaSlider";

export default function Sports() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sliders, setSliders] = useState([]);
  const [sportsData, setSportsData] = useState({
    live: [],
    upcoming: [],
    popular: [],
    cricket: [],
    football: [],
    tennis: [],
    basketball: [],
  });

  useEffect(() => {
    fetchSportsData();
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
      const response = await getSlidersApi("sports");
      if (response?.data?.sliders && Array.isArray(response.data.sliders)) {
        setSliders(response.data.sliders);
      } else {
        console.error("Response structure is not as expected:", response);
        setSliders([]);
      }
    } catch (error) {
      console.error("Error fetching sliders:", error);
      setError("Failed to load featured sports");
    }
  };

  const fetchSportsData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [liveRes, upcomingRes, popularRes] = await Promise.all([
        getLiveSports(),
        getUpcomingSports(),
        getPopularSports(),
      ]);

      if (!liveRes.success) throw new Error("Failed to load live sports");
      if (!upcomingRes.success)
        throw new Error("Failed to load upcoming sports");
      if (!popularRes.success) throw new Error("Failed to load popular sports");

      setSportsData({
        live: liveRes.data || [],
        upcoming: upcomingRes.data || [],
        popular: popularRes.data || [],
      });

      // Fetch category-specific data
      const categoryData = await Promise.all(
        ["Cricket", "Football", "Tennis", "Basketball"].map((category) =>
          getSportsByCategory(category)
        )
      );

      const categorizedData = categoryData.reduce((acc, res, index) => {
        const category = ["cricket", "football", "tennis", "basketball"][index];
        acc[category] = res.success ? res.data : [];
        return acc;
      }, {});

      setSportsData((prev) => ({ ...prev, ...categorizedData }));
    } catch (error) {
      console.error("Error fetching sports data:", error);
      setError(error.message || "Failed to load sports content");
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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
        px: 2,
        bgcolor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 2,
        minHeight: "200px",
        width: "100%",
        maxWidth: "100%",
      }}
    >
      {/* <SportsEsports sx={{ fontSize: 48, color: "grey.500", mb: 2 }} /> */}
      <Typography variant="h6" color="grey.500" textAlign="center">
        {message}
      </Typography>
      <Typography
        variant="body2"
        color="grey.600"
        textAlign="center"
        sx={{ mt: 1 }}
      >
        Please check back later for updates
      </Typography>
    </Box>
  );

  // Live match card component
  // LiveMatch card component with styling consistent with MediaSlider
  const LiveMatchCard = ({ match, isLive }) => (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      onClick={() => navigate(`/media/${match._id}`)}
      sx={{
        position: "relative",
        width: "100%",
        aspectRatio: "2/3",
        borderRadius: 1,
        overflow: "hidden",
        cursor: "pointer",
        bgcolor: "#1a1a1a",
        height: "100%",
      }}
    >
      <Box
        component="img"
        src={getMediaUrl(match.posterUrl, "poster")}
        alt={match.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/placeholder-poster.jpg";
        }}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      {isLive && (
        <Chip
          icon={<LiveTv />}
          label="LIVE"
          color="error"
          size="small"
          sx={{ position: "absolute", top: 10, right: 10 }}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          p: 1,
          background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
          color: "white",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {match.title || "Match Title"}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mt: 0.5, gap: 1 }}>
          {isLive ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <LiveTv sx={{ fontSize: 16, color: "error.main" }} />
              <Typography variant="caption">LIVE</Typography>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Schedule sx={{ fontSize: 16 }} />
              <Typography variant="caption">
                {match.startTime || "TBD"}
              </Typography>
            </Box>
          )}
          {match.tournament && (
            <Typography
              variant="caption"
              sx={{
                maxWidth: "70%",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {match.tournament}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );

  if (loading) {
    return <CustomLoader message="Loading sports content..." />;
  }

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
            fetchSportsData();
            fetchSliders();
          }}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  // Show message if no sliders are available (like in Movies component)
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
      style={{ width: "100%", maxWidth: "100%", minHeight: "100vh" }}
    >
      {/* Banner/Hero Section - Now using the movie-style approach */}
      <Box
        sx={{
          position: "relative",
          height: "80vh",
          overflow: "hidden",
          width: "100%",
          maxWidth: "100%",
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
                  getMediaUrl(sliders[currentSlide], "image") || ""
                })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                px: { xs: 2, md: 6 },
              }}
            >
              {/* Content box positioned like in Movies component */}
              <Box sx={{ maxWidth: 600 }}>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                      mb: 3,
                      color: "white",
                      fontWeight: "bold",
                      fontSize: { xs: "2rem", sm: "3rem", md: "3.5rem" },
                      textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                    }}
                  >
                    {sliders[currentSlide]?.title}
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
                    {sliders[currentSlide]?.description}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PlayCircle />}
                      onClick={() =>
                        navigate(`/media/${sliders[currentSlide]?._id}`)
                      }
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
                      onClick={() =>
                        navigate(`/media/${sliders[currentSlide]?._id}`)
                      }
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

        {/* Banner Navigation Controls */}
        {sliders.length > 1 && (
          <>
            <IconButton
              onClick={prevSlide}
              sx={{
                position: "absolute",
                left: 20,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0,0,0,0.5)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                color: "white",
              }}
            >
              <ChevronLeft fontSize="large" />
            </IconButton>

            <IconButton
              onClick={nextSlide}
              sx={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                bgcolor: "rgba(0,0,0,0.5)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                color: "white",
              }}
            >
              <ChevronRight fontSize="large" />
            </IconButton>

            {/* Slide Indicators - Added from Movies component */}
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

      {/* Sports Categories */}
      <Box
        sx={{
          mt: 4,
          px: { xs: 2, md: 6 },
          width: "100%",
          maxWidth: "100%",
        }}
      >
        {/* Live Sports */}
        <Box sx={{ mb: 6, width: "100%", maxWidth: "100%" }}>
          <Typography
            variant="h4"
            sx={{ mb: 3, fontWeight: "bold", color: "white" }}
          >
            Live Sports
          </Typography>
          {sportsData.live.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                width: "100%",
                maxWidth: "100%",
              }}
            >
              {sportsData.live.map((match, index) => (
                <Box
                  key={match._id || index}
                  sx={{
                    flex: {
                      xs: "0 0 calc(50% - 8px)",
                      sm: "0 0 calc(33.333% - 11px)",
                      md: "0 0 calc(25% - 12px)",
                      lg: "0 0 calc(20% - 13px)",
                    },
                    maxWidth: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                      md: "calc(25% - 12px)",
                      lg: "calc(20% - 13px)",
                    },
                  }}
                >
                  <LiveMatchCard match={match} isLive={true} />
                </Box>
              ))}
            </Box>
          ) : (
            <EmptyState message="No live sports events at the moment" />
          )}
        </Box>

        {/* Upcoming Sports - Using same layout as Live Sports */}
        <Box sx={{ mb: 6, width: "100%", maxWidth: "100%" }}>
          <Typography
            variant="h4"
            sx={{ mb: 3, fontWeight: "bold", color: "white" }}
          >
            Upcoming Events
          </Typography>
          {sportsData.upcoming.length > 0 ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                width: "100%",
                maxWidth: "100%",
              }}
            >
              {sportsData.upcoming.map((match, index) => (
                <Box
                  key={match._id || index}
                  sx={{
                    flex: {
                      xs: "0 0 calc(50% - 8px)",
                      sm: "0 0 calc(33.333% - 11px)",
                      md: "0 0 calc(25% - 12px)",
                      lg: "0 0 calc(20% - 13px)",
                    },
                    maxWidth: {
                      xs: "calc(50% - 8px)",
                      sm: "calc(33.333% - 11px)",
                      md: "calc(25% - 12px)",
                      lg: "calc(20% - 13px)",
                    },
                  }}
                >
                  <LiveMatchCard match={match} isLive={false} />
                </Box>
              ))}
            </Box>
          ) : (
            <EmptyState message="No upcoming sports events" />
          )}
        </Box>

        {/* Popular Sports - Now using the custom SportsMediaSlider instead of MediaSlider */}

        <SportsMediaSlider
          title="Popular in Sports"
          items={sportsData.popular}
          
        />
        
        {/* Category-specific content - Now using the custom SportsMediaSlider instead of MediaSlider */}
        {sportsData.cricket.length > 0 && (
          <SportsMediaSlider title="Cricket" items={sportsData.cricket} />
        )}
        {sportsData.football.length > 0 && (
          <SportsMediaSlider title="Football" items={sportsData.football} />
        )}
        {sportsData.tennis.length > 0 && (
          <SportsMediaSlider title="Tennis" items={sportsData.tennis} />
        )}
        {sportsData.basketball.length > 0 && (
          <SportsMediaSlider title="Basketball" items={sportsData.basketball} />
        )}
      </Box>
    </motion.div>
  );
}

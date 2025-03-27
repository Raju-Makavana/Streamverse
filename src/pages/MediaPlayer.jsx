import React, { useState, useEffect, useRef } from "react";
import Hls from "hls.js";
import {
  Box,
  IconButton,
  Slider,
  Typography,
  Menu,
  MenuItem,
  Fade,
  Stack,
  CircularProgress,
  Card,
  Tooltip,
  alpha,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Settings,
  ArrowBack,
  Fullscreen,
  FullscreenExit,
  Replay10,
  Forward10,
  Info,
  ThumbUpAlt,
  Add,
  Bookmark,
  Share,
  MoreHoriz,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  CheckCircleOutline,
} from "@mui/icons-material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { getMediaStreamApi, fetchMediaDetailsApi } from "../apis/mediaApis";
import { getEnvConfig } from "../config/envConfig";
import { updateWatchHistory } from "../utils/authUtils";
import { CardMedia } from "@mui/material";
import { Grid, Paper } from "@mui/material";
import AuthDialog from "../components/AuthDialog";

const QUALITY_LEVELS = [
  { label: "Auto", value: "auto" },
  { label: "240p", value: "240p" },
  { label: "480p", value: "480p" },
  { label: "720p (HD)", value: "720p" },
  { label: "1080p (FHD)", value: "1080p" }
];

const VideoContainer = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  maxWidth: "100%",
  aspectRatio: "16/9",
  backgroundColor: "#000",
  margin: "0 auto",
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  "&:hover .controls": {
    opacity: 1,
    visibility: "visible",
  },
  "&:fullscreen": {
    width: "100vw",
    height: "100vh",
    borderRadius: 0,
    "& .controls": {
      opacity: 1,
      visibility: "visible",
    },
  },
  "& video": {
    width: "100% !important", 
    height: "100% !important", 
    objectFit: "contain !important",
    backgroundColor: "#000",
    minWidth: "100% !important",
    minHeight: "100% !important",
  },
}));

const Controls = styled(Box)(({ theme }) => ({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2, 3, 3),
  background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)",
  opacity: 0,
  visibility: "hidden",
  transition: "all 0.3s ease-in-out",
  zIndex: 100,
  "&:hover": {
    opacity: 1,
    visibility: "visible",
  },
  "&:fullscreen &": {
    opacity: 1,
    visibility: "visible",
  },
}));

const MediaInfo = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "20%",
  left: theme.spacing(3),
  color: "white",
  maxWidth: "400px",
  background: "rgba(0,0,0,0.75)",
  backdropFilter: "blur(10px)",
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  animation: "fadeIn 0.3s ease-in-out",
  zIndex: 50, // Ensure it's above video but below controls
  "@keyframes fadeIn": {
    "0%": {
      opacity: 0,
      transform: "translateY(-10px)",
    },
    "100%": {
      opacity: 1,
      transform: "translateY(0)",
    },
  },
}));

const SkipButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "rgba(0,0,0,0.4)",
  backdropFilter: "blur(5px)",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.2)",
    transform: "scale(1.1)",
  },
  height: 48,
  width: 48,
}));

const TopBar = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  padding: theme.spacing(2, 3),
  background: "linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  zIndex: 100, // Ensure it's above all content
}));

// Custom Slider with modern design
const CustomSlider = styled(Slider)(({ theme }) => ({
  color: theme.palette.primary.main,
  height: 4,
  padding: "15px 0",
  "& .MuiSlider-thumb": {
    width: 12,
    height: 12,
    transition: "0.2s cubic-bezier(.47,1.64,.41,.8)",
    "&:hover, &.Mui-focusVisible": {
      boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.primary.main, 0.16)}`,
      transform: "scale(1.2)",
    },
    "&.Mui-active": {
      width: 14,
      height: 14,
    },
  },
  "& .MuiSlider-rail": {
    opacity: 0.3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  "& .MuiSlider-track": {
    transition: "width 0.1s ease",
  },
}));

const BufferingOverlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(4px)",
  zIndex: 75, // Above video but below controls
});

const ControlButton = styled(IconButton)(({ theme }) => ({
  color: "white",
  transition: "transform 0.2s ease",
  "&:hover": {
    transform: "scale(1.1)",
  },
}));

const MediaSlider = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(6),
  position: "relative",
  "& .title": {
    marginBottom: theme.spacing(2),
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    "&::before": {
      content: '""',
      width: 4,
      height: 24,
      backgroundColor: theme.palette.primary.main,
      borderRadius: 2,
    },
  },
  "& .slider-container": {
    position: "relative",
    overflow: "hidden",
    margin: theme.spacing(0, -2),
    padding: theme.spacing(0, 2),
  },
  "& .slider-wrapper": {
    display: "flex",
    transition: "transform 0.3s ease-in-out",
    gap: theme.spacing(2),
  },
}));

const MediaCard = styled(Card)(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius * 1.5,
  overflow: "hidden",
  backgroundColor: theme.palette.background.paper,
  boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-8px)",
    boxShadow: "0 12px 20px rgba(0,0,0,0.15)",
    "& .card-overlay": {
      opacity: 1,
    },
    "& .card-content": {
      transform: "translateY(-4px)",
    },
  },
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const CardOverlay = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  opacity: 0,
  transition: "opacity 0.3s ease",
  zIndex: 1,
}));

const SliderNavButton = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 2,
  backgroundColor: "rgba(0,0,0,0.5)",
  color: "white",
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
  width: 40,
  height: 40,
  "&.Mui-disabled": {
    opacity: 0.5,
    cursor: "not-allowed",
  },
}));

// Custom styled menu for quality selection
const QualityMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    backgroundColor: "rgba(28, 28, 28, 0.95)",
    backdropFilter: "blur(10px)",
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "white",
    minWidth: "240px",
    maxWidth: "90vw",
    zIndex: 99999,
    padding: theme.spacing(1),
  },
  "& .MuiList-root": {
    padding: 0,
  },
  "& .MuiMenuItem-root": {
    borderRadius: theme.shape.borderRadius,
    margin: "4px 0",
    padding: "8px 16px",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    "&.Mui-selected": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.2)",
      },
    },
  },
}));

// Add new styled components for YouTube-like quality menu
const QualityHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  marginBottom: theme.spacing(1),
}));

const QualityOption = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "8px 16px",
  "& .quality-label": {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
  },
  "& .quality-icon": {
    color: "#90CAF9",
    marginRight: theme.spacing(1),
  },
  "& .quality-badge": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "0.75rem",
    color: "rgba(255, 255, 255, 0.7)",
  },
}));

function MediaPlayer() {
  const navigate = useNavigate();
  const { mediaId } = useParams();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const videoRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const hlsInstanceRef = useRef(null);
  const mediaInfoRef = useRef(null);
  const mediaInfoTimeoutRef = useRef(null);
  const sliderRef = useRef(null);
  const sliderWrapperRef = useRef(null);
  
  const startTime = location.state?.startTime || 0;
  
  const [mediaDetails, setMediaDetails] = useState(null);
  const [mediaUrl, setMediaUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hideControls, setHideControls] = useState(false);
  const [qualityLevels, setQualityLevels] = useState(QUALITY_LEVELS);
  const [currentQuality, setCurrentQuality] = useState("auto");
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [showRelatedMedia, setShowRelatedMedia] = useState(false);
  const [relatedMedia, setRelatedMedia] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [playerError, setPlayerError] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [visibleSlides, setVisibleSlides] = useState(5);
  
  const historyUpdateInterval = useRef(null);
  const lastUpdateTime = useRef(0);
  
  const settingsButtonRef = useRef(null);
  
  // Resize handler for responsive design
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) setVisibleSlides(2);
      else if (window.innerWidth < 900) setVisibleSlides(3);
      else if (window.innerWidth < 1200) setVisibleSlides(4);
      else setVisibleSlides(5);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch media data
  useEffect(() => {
    const fetchMediaData = async () => {
      try {
        setLoading(true);
        
        // Fetch media details
        const detailsResponse = await fetchMediaDetailsApi(mediaId);
        if (detailsResponse.success !== false) {
          setMediaDetails(detailsResponse.data);
        }
        
        // Fetch stream URL
        const response = await getMediaStreamApi(mediaId);
        if (response.success) {
          setMediaUrl(response.data.streamUrl);
          if (videoRef.current) {
            setHasInteracted(true); // Set to true so player can start automatically if possible
          }
        } else {
          setPlayerError("Failed to load media. Please try again later.");
        }
      } catch (error) {
        console.error("Error fetching media:", error);
        setPlayerError("An error occurred while loading the media. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMediaData();
    
    // Set up cleanup
    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
      }
      if (historyUpdateInterval.current) {
        clearInterval(historyUpdateInterval.current);
      }
    };
  }, [mediaId]);

  // Set up history tracking interval
  useEffect(() => {
    if (isAuthenticated && mediaDetails && duration > 0) {
      // Clear any existing interval
      if (historyUpdateInterval.current) {
        clearInterval(historyUpdateInterval.current);
      }
      
      // Set up an interval to update history every 30 seconds
      historyUpdateInterval.current = setInterval(() => {
        if (videoRef.current && currentTime > 0 && currentTime !== lastUpdateTime.current) {
          updateWatchHistory(mediaId, currentTime, duration);
          lastUpdateTime.current = currentTime;
        }
      }, 30000); // 30 seconds
      
      // Return cleanup function
      return () => {
        if (historyUpdateInterval.current) {
          clearInterval(historyUpdateInterval.current);
        }
        
        // Save final position when component unmounts
        if (currentTime > 0 && duration > 0) {
          updateWatchHistory(mediaId, currentTime, duration);
        }
      };
    }
  }, [isAuthenticated, mediaDetails, duration, mediaId]);

  // Set start time when video is loaded and ready
  useEffect(() => {
    if (videoRef.current && startTime > 0 && duration > 0 && hasInteracted) {
      videoRef.current.currentTime = startTime;
      setCurrentTime(startTime);
    }
  }, [startTime, duration, hasInteracted]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      
      // Force maintain video dimensions after fullscreen change
      forceVideoDimensions();
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Function to force maintain video dimensions
  const forceVideoDimensions = () => {
    if (videoRef.current) {
      // Apply important inline styles
      videoRef.current.style.width = '100%';
      videoRef.current.style.height = '100%';
      videoRef.current.style.minWidth = '100%';
      videoRef.current.style.minHeight = '100%';
      videoRef.current.style.objectFit = 'contain';
      
      // Use requestAnimationFrame to ensure styles are applied after render
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.style.width = '100%';
          videoRef.current.style.height = '100%';
          videoRef.current.style.minWidth = '100%';
          videoRef.current.style.minHeight = '100%';
          videoRef.current.style.objectFit = 'contain';
        }
      });
    }
  };

  // HLS initialization
  useEffect(() => {
    const initializeHLS = () => {
      const videoElement = videoRef.current;

      if (!videoElement || !mediaDetails?.videoUrl?.resolutions?.masterPlaylist)
        return;

      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
      }

      const masterPlaylistUrl = `${getEnvConfig.get(
        "backendURI"
      )}/public/uploads/videos/${mediaId}/hls/master.m3u8`;

      if (Hls.isSupported()) {
        const hls = new Hls({
          debug: false,
          startLevel: -1,
          autoLevelCapping: -1,
          capLevelToPlayerSize: true,
          manifestLoadingTimeOut: 15000,
          manifestLoadingMaxRetry: 5,
          levelLoadingTimeOut: 15000,
          levelLoadingMaxRetry: 5,
        });
  
        hlsInstanceRef.current = hls;

        // Handle manifest parsing
        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          console.log("HLS Manifest Parsed:", data);
          const levels = data.levels;
          
          // Map available qualities from levels
          const availableQualities = QUALITY_LEVELS.filter(quality => {
            if (quality.value === "auto") return true;
            
            const height = parseInt(quality.value);
            return levels.some(level => level.height <= height);
          });

          setQualityLevels(availableQualities);
          setCurrentQuality("auto");
          
          // Force maintain video dimensions
          forceVideoDimensions();
        });

        // Handle level switching
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          const currentLevel = data.level;
          const quality = currentLevel === -1 ? "auto" : 
            `${hls.levels[currentLevel]?.height || "auto"}p`;
          
          setCurrentQuality(quality);
          forceVideoDimensions();
        });

        // Handle loading states
        hls.on(Hls.Events.LEVEL_LOADING, () => {
          setBuffering(true);
        });

        hls.on(Hls.Events.FRAG_LOADED, () => {
          // Force maintain video dimensions after fragment load
          forceVideoDimensions();
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError();
                break;
              default:
                initializeHLS();
                break;
            }
          }
        });

        try {
          hls.loadSource(masterPlaylistUrl);
          hls.attachMedia(videoElement);

          videoElement.play().catch((error) => {
            console.error("Autoplay prevented:", error);
          });
          
          // Force maintain video dimensions
          forceVideoDimensions();
        } catch (error) {
          console.error("HLS Source Loading Error:", error);
        }
      } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari)
        videoElement.src = masterPlaylistUrl;
      }
    };

    initializeHLS();

    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
      }
    };
  }, [mediaDetails, mediaId]);

  const handleSkip = (seconds) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleDoubleClick = () => {
    handlePlayPause();
    setHovered(true);
    setTimeout(() => setHovered(false), 500);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case " ":
          handlePlayPause();
          break;
        case "ArrowRight":
          handleSkip(10);
          break;
        case "ArrowLeft":
          handleSkip(-10);
          break;
        case "f":
          toggleFullscreen();
          break;
        case "m":
          handleMute();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !muted;
      setMuted(!muted);
    }
  };

  const handleVolumeChange = (event, newValue) => {
    if (videoRef.current) {
      videoRef.current.volume = newValue;
      setVolume(newValue);
    }
  };

  const handleProgress = (event, newValue) => {
    const time = (newValue * duration) / 100;
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const getCurrentQualityDisplay = () => {
    const quality = currentQuality;
    if (quality === "auto") return "Auto";
    
    const qualityLabels = {
      "240p": "240p",
      "480p": "480p",
      "720p": "720p (HD)",
      "1080p": "1080p (FHD)"
    };
    
    return qualityLabels[quality] || quality;
  };

  const handleSettingsClick = (event) => {
    event.stopPropagation(); // Prevent event bubbling
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleQualityChange = (quality) => {
    if (quality === currentQuality) {
      setSettingsAnchorEl(null);
      return;
    }

    setSettingsAnchorEl(null);
    setBuffering(true);

    // Store current playback state
    const currentTime = videoRef.current?.currentTime || 0;
    const wasPlaying = isPlaying;

    if (hlsInstanceRef.current) {
      if (quality === "auto") {
        hlsInstanceRef.current.currentLevel = -1;
        hlsInstanceRef.current.nextLevel = -1;
      } else {
        const targetHeight = parseInt(quality);
        const levels = hlsInstanceRef.current.levels || [];
        
        // Find the best matching level
        let bestLevelIndex = -1;
        let bestHeight = 0;
        
        levels.forEach((level, index) => {
          if (level.height <= targetHeight && level.height > bestHeight) {
            bestHeight = level.height;
            bestLevelIndex = index;
          }
        });

        if (bestLevelIndex !== -1) {
          hlsInstanceRef.current.currentLevel = bestLevelIndex;
          hlsInstanceRef.current.nextLevel = bestLevelIndex;
        }
      }

      // Resume playback at the same position
      if (videoRef.current) {
        forceVideoDimensions();
        videoRef.current.currentTime = currentTime;
        if (wasPlaying) {
          videoRef.current.play().catch((error) => {
            console.error("Playback error:", error);
          });
        }
      }
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await playerContainerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
      // Force maintain video dimensions
      forceVideoDimensions();
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMouseMove = () => {
    setHideControls(false);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setHideControls(true);
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setHideControls(true);
  };

  const handleSliderPrev = () => {
    setCurrentSlide(Math.max(0, currentSlide - visibleSlides));
  };

  const handleSliderNext = () => {
    setCurrentSlide(Math.min(relatedMedia.length - visibleSlides, currentSlide + visibleSlides));
  };

  const handleMediaClick = (id) => {
    navigate(`/media/${id}`);
  };

  // Handle when video ends
  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (isAuthenticated && mediaDetails) {
      // Mark as completed (100% watched)
      updateWatchHistory(mediaId, duration, duration);
    }
  };

  const handleCloseAuthDialog = () => {
    setShowAuthDialog(false);
  };

  // Handle timeupdate event to track progress
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      
      // Update watch history when significant progress has been made (10% change)
      if (isAuthenticated && duration > 0) {
        const lastTimePercent = Math.floor((lastUpdateTime.current / duration) * 10);
        const currentTimePercent = Math.floor((time / duration) * 10);
        
        if (currentTimePercent !== lastTimePercent) {
          updateWatchHistory(mediaId, time, duration);
          lastUpdateTime.current = time;
        }
      }
    }
  };

  return (
    <Box sx={{ 
      width: '100%',
      maxWidth: '100%',
      overflow: 'hidden',
      bgcolor: '#000',
      position: 'relative' // This is important for menu positioning
    }}>
      <VideoContainer
        ref={playerContainerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleDoubleClick}
      >
        <video
          ref={videoRef}
          style={{
            width: '100% !important',
            height: '100% !important',
            objectFit: 'contain',
            backgroundColor: '#000',
            minWidth: '100%',
            minHeight: '100%',
          }}
          autoPlay
          playsInline
          muted={muted}
          onLoadedMetadata={(e) => {
            setDuration(e.target.duration);
            setBuffering(false);
          }}
          onTimeUpdate={handleTimeUpdate}
          onWaiting={() => {
            setBuffering(true);
          }}
          onPlaying={() => {
            setBuffering(false);
          }}
          onError={(e) => {
            console.error("Video playback error:", e);
            setBuffering(false);
          }}
          onEnded={handleVideoEnded}
        />

        {showInfo && mediaDetails && (
          <MediaInfo>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>{mediaDetails.title}</Typography>
            <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
              {mediaDetails.description}
            </Typography>
            {mediaDetails.year && (
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {mediaDetails.year} • {mediaDetails.duration} • {mediaDetails.genre}
              </Typography>
            )}
          </MediaInfo>
        )}

        {buffering && (
          <BufferingOverlay>
            <CircularProgress sx={{ color: "white" }} size={60} />
          </BufferingOverlay>
        )}

        <Fade in={!hideControls}>
          <Box>
            <TopBar>
              <IconButton
                onClick={() => window.history.back()}
                sx={{ color: "white" }}
              >
                <ArrowBack />
              </IconButton>
              <Stack direction="row" spacing={1}>
                <Tooltip title="Save to Playlist">
                  <ControlButton>
                    <Bookmark />
                  </ControlButton>
                </Tooltip>
                <Tooltip title="Share">
                  <ControlButton>
                    <Share />
                  </ControlButton>
                </Tooltip>
                <Tooltip title="More Options">
                  <ControlButton>
                    <MoreHoriz />
                  </ControlButton>
                </Tooltip>
              </Stack>
            </TopBar>

            <Controls className="controls">
              <CustomSlider
                value={(currentTime / duration) * 100 || 0}
                onChange={handleProgress}
                sx={{ mb: 2 }}
              />

              <Stack direction="row" spacing={2} alignItems="center">
                <SkipButton onClick={() => handleSkip(-10)}>
                  <Replay10 sx={{ color: "white" }} />
                </SkipButton>

                <IconButton 
                  onClick={handlePlayPause} 
                  sx={{ 
                    color: "white", 
                    backgroundColor: "rgba(255,255,255,0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.2)",
                    },
                    transition: "all 0.2s ease",
                    width: 56,
                    height: 56,
                  }}
                >
                  {isPlaying ? (
                    <Pause sx={{ fontSize: "2rem" }} />
                  ) : (
                    <PlayArrow sx={{ fontSize: "2rem" }} />
                  )}
                </IconButton>

                <SkipButton onClick={() => handleSkip(10)}>
                  <Forward10 sx={{ color: "white" }} />
                </SkipButton>

                <Box sx={{ flexGrow: 1 }} />

                <Typography variant="body2" sx={{ color: "white", mr: 2 }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </Typography>

                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <IconButton onClick={handleMute} sx={{ color: "white" }}>
                    {muted || volume === 0 ? (
                      <VolumeOff />
                    ) : (
                      <VolumeUp />
                    )}
                  </IconButton>

                  <Box
                    sx={{
                      width: 100,
                      mx: 1,
                      display: !hideControls ? "block" : "none",
                    }}
                  >
                    <Slider
                      min={0}
                      max={1}
                      step={0.01}
                      value={muted ? 0 : volume}
                      onChange={handleVolumeChange}
                      sx={{ color: "white" }}
                    />
                  </Box>
                </Box>

                <Tooltip title="Information">
                  <IconButton
                    onClick={() => setShowInfo(!showInfo)}
                    sx={{ color: "white" }}
                  >
                    <Info />
                  </IconButton>
                </Tooltip>

                <IconButton
                  ref={settingsButtonRef}
                  onClick={handleSettingsClick}
                  sx={{ 
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.1)",
                    }
                  }}
                >
                  <Settings />
                </IconButton>

                <IconButton onClick={toggleFullscreen} sx={{ color: "white" }}>
                  {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                </IconButton>

                <QualityMenu
                  id="quality-menu"
                  anchorEl={settingsAnchorEl}
                  open={Boolean(settingsAnchorEl)}
                  onClose={() => setSettingsAnchorEl(null)}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  TransitionComponent={Fade}
                  PaperProps={{
                    sx: {
                      position: 'fixed',
                      top: 'auto',
                      bottom: 'auto',
                      left: 'auto',
                      right: 'auto',
                      zIndex: 99999,
                    }
                  }}
                >
                  <QualityHeader>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: "white",
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <Settings sx={{ fontSize: 20 }} />
                      Quality
                    </Typography>
                  </QualityHeader>
                  
                  {qualityLevels.map((quality) => (
                    <QualityOption
                      key={quality.value}
                      onClick={() => handleQualityChange(quality.value)}
                      selected={currentQuality === quality.value}
                    >
                      <Box className="quality-label">
                        {currentQuality === quality.value && (
                          <CheckCircleOutline className="quality-icon" />
                        )}
                        <Typography variant="body2">
                          {quality.label}
                        </Typography>
                      </Box>
                      {currentQuality === quality.value && (
                        <Typography className="quality-badge">
                          Current
                        </Typography>
                      )}
                    </QualityOption>
                  ))}
                </QualityMenu>
              </Stack>
            </Controls>
          </Box>
        </Fade>
      </VideoContainer>

      <MediaSlider ref={sliderRef} sx={{ p: 4 }}>
        <Typography variant="h6" className="title">
          More Like This
        </Typography>
        <Box className="slider-container">
          {relatedMedia.length > visibleSlides && (
            <SliderNavButton
              onClick={handleSliderPrev}
              sx={{ left: 0 }}
              disabled={currentSlide === 0}
            >
              <KeyboardArrowLeft />
            </SliderNavButton>
          )}
          
          <Box 
            className="slider-wrapper" 
            sx={{ 
              transform: `translateX(-${currentSlide * (100 / visibleSlides)}%)`,
              display: 'grid',
              gridTemplateColumns: `repeat(${relatedMedia.length}, calc(${100 / visibleSlides}% - 16px))`,
              gap: '16px'
            }}
          >
            {relatedMedia.map((item) => (
              <Box key={item.id}>
                <MediaCard onClick={() => handleMediaClick(item.id)}>
                  <CardMedia
                    component="img"
                    image={item.thumbnail}
                    alt={item.title}
                    sx={{ 
                      aspectRatio: '16/9',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  <CardOverlay className="card-overlay">
                    <IconButton
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        width: 48,
                        height: 48,
                      }}
                    >
                      <PlayArrow sx={{ fontSize: 32 }} />
                    </IconButton>
                  </CardOverlay>
                  <CardContent 
                    className="card-content"
                    sx={{ 
                      flexGrow: 1,
                      p: 2,
                      transition: 'transform 0.3s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1
                    }}
                  >
                    <Typography 
                      variant="subtitle1" 
                      noWrap 
                      fontWeight="bold"
                      sx={{ 
                        fontSize: '1rem',
                        lineHeight: 1.4,
                        mb: 0.5
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontSize: '0.875rem',
                        opacity: 0.7
                      }}
                    >
                      {item.duration}
                    </Typography>
                  </CardContent>
                </MediaCard>
              </Box>
            ))}
          </Box>
          
          {relatedMedia.length > visibleSlides && (
            <SliderNavButton
              onClick={handleSliderNext}
              sx={{ right: 0 }}
              disabled={currentSlide >= relatedMedia.length - visibleSlides}
            >
              <KeyboardArrowRight />
            </SliderNavButton>
          )}
        </Box>
      </MediaSlider>

      <AuthDialog 
        open={showAuthDialog}
        onClose={handleCloseAuthDialog}
        message="Please login to track your watch history and continue where you left off."
      />
    </Box>
  );
}

export default MediaPlayer;
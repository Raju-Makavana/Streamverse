// Frontend Components

// LiveStreamPlayer.jsx
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { 
  Box, 
  Typography, 
  Paper, 
  Chip, 
  Stack,
  IconButton,
  Slider,
  Menu,
  MenuItem,
  CircularProgress 
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  VolumeUp, 
  VolumeOff,
  SettingsOutlined,
  FullscreenOutlined
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const VideoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: '56.25%', // 16:9 aspect ratio
  backgroundColor: '#000',
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden'
}));

const VideoElement = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain'
});

const ControlsOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  transition: 'opacity 0.3s ease',
  opacity: 0,
  '&:hover': {
    opacity: 1
  }
}));

const LiveBadge = styled(Chip)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.error.contrastText,
  fontWeight: 'bold',
  width: 'fit-content'
}));

export const LiveStreamPlayer = ({ streamId }) => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [loading, setLoading] = useState(true);
  const [qualityMenu, setQualityMenu] = useState(null);
  const [currentQuality, setCurrentQuality] = useState('Auto');
  
  const qualities = ['Auto', '1080p', '720p', '480p', '360p', '240p'];
  
  useEffect(() => {
    const video = videoRef.current;
    let hls;
    
    if (Hls.isSupported()) {
      hls = new Hls({
        startLevel: 3, // Start with a medium quality
        autoStartLoad: true
      });
      
      // Replace with your actual stream URL
      const streamUrl = `http://your-server:8000/live/${streamId}/index.m3u8`;
      
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        if (playing) video.play().catch(e => console.error('Autoplay prevented:', e));
      });
      
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.error('HLS error:', data);
          // Attempt to recover
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              // Cannot recover
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // For Safari
      video.src = `http://your-server:8000/live/${streamId}/index.m3u8`;
      video.addEventListener('loadedmetadata', () => {
        setLoading(false);
        if (playing) video.play().catch(e => console.error('Autoplay prevented:', e));
      });
    }
    
    return () => {
      if (hls) {
        hls.destroy();
      }
      if (video) {
        video.pause();
        video.src = '';
        video.load();
      }
    };
  }, [streamId, playing]);
  
  // Handle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (playing) {
      video.pause();
    } else {
      video.play().catch(e => console.error('Play failed:', e));
    }
    setPlaying(!playing);
  };
  
  // Handle mute/unmute
  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !muted;
    setMuted(!muted);
  };
  
  // Handle volume change
  const handleVolumeChange = (event, newValue) => {
    const video = videoRef.current;
    video.volume = newValue / 100;
    setVolume(newValue);
    if (newValue === 0 && !muted) {
      setMuted(true);
      video.muted = true;
    } else if (newValue > 0 && muted) {
      setMuted(false);
      video.muted = false;
    }
  };
  
  // Handle quality selection
  const handleQualityChange = (quality) => {
    // In a real implementation, you would switch quality levels here
    // For example, with HLS.js you can set hls.currentLevel to a specific index
    setCurrentQuality(quality);
    setQualityMenu(null);
  };
  
  // Handle fullscreen
  const toggleFullscreen = () => {
    const videoContainer = videoRef.current.parentElement;
    
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  return (
    <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2, mb: 3 }}>
      <VideoContainer>
        <VideoElement
          ref={videoRef}
          playsInline
          onClick={togglePlay}
          onLoadStart={() => setLoading(true)}
        />
        
        {loading && (
          <Box 
            position="absolute" 
            top="0" 
            left="0" 
            right="0" 
            bottom="0" 
            display="flex" 
            alignItems="center" 
            justifyContent="center"
          >
            <CircularProgress color="primary" />
          </Box>
        )}
        
        <ControlsOverlay>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <LiveBadge 
              label="LIVE" 
              size="small" 
              icon={<Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'white', mr: 0.5 }} />} 
            />
            
            <IconButton 
              color="inherit" 
              onClick={toggleFullscreen}
              sx={{ color: 'white' }}
            >
              <FullscreenOutlined />
            </IconButton>
          </Stack>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton color="inherit" onClick={togglePlay} sx={{ color: 'white' }}>
              {playing ? <Pause /> : <PlayArrow />}
            </IconButton>
            
            <IconButton color="inherit" onClick={toggleMute} sx={{ color: 'white' }}>
              {muted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
            
            <Slider
              size="small"
              value={volume}
              onChange={handleVolumeChange}
              aria-label="Volume"
              min={0}
              max={100}
              sx={{ 
                width: 100, 
                color: 'white',
                '& .MuiSlider-thumb': {
                  width: 10,
                  height: 10,
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: 'none',
                  }
                }
              }}
            />
            
            <Box sx={{ flexGrow: 1 }} />
            
            <IconButton 
              color="inherit" 
              onClick={(e) => setQualityMenu(e.currentTarget)}
              sx={{ color: 'white' }}
            >
              <SettingsOutlined />
            </IconButton>
            
            <Menu
              anchorEl={qualityMenu}
              open={Boolean(qualityMenu)}
              onClose={() => setQualityMenu(null)}
            >
              {qualities.map((quality) => (
                <MenuItem 
                  key={quality} 
                  onClick={() => handleQualityChange(quality)}
                  selected={currentQuality === quality}
                >
                  {quality}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
        </ControlsOverlay>
      </VideoContainer>
      
      <Box sx={{ p: 2 }}>
        <Typography variant="h5" gutterBottom>
          IPL 2023: Mumbai Indians vs Chennai Super Kings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Live from Wankhede Stadium • 15,423 watching
        </Typography>
      </Box>
    </Paper>
  );
};

// LiveStreamsPage.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Box, 
  Chip,
  Skeleton,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';

export const LiveStreamsPage = () => {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchLiveStreams = async () => {
      try {
        const response = await axios.get('/api/live-streams');
        setStreams(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching streams:', error);
        setLoading(false);
      }
    };
    
    fetchLiveStreams();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchLiveStreams, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Live Matches</Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((item) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={item}>
              <Card sx={{ height: '100%' }}>
                <Skeleton variant="rectangular" height={140} />
                <CardContent>
                  <Skeleton variant="text" />
                  <Skeleton variant="text" width="60%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Live Matches</Typography>
      
      {streams.length === 0 ? (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            height: 300
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No live matches at the moment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Check back later for upcoming matches
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {streams.map((stream) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={stream.id}>
              <Card 
                component={Link} 
                to={`/watch/${stream.id}`} 
                sx={{ 
                  height: '100%', 
                  textDecoration: 'none',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="140"
                    image={stream.thumbnail}
                    alt={stream.title}
                  />
                  <Chip
                    label="LIVE"
                    size="small"
                    color="error"
                    sx={{ 
                      position: 'absolute', 
                      top: 10, 
                      left: 10,
                      fontWeight: 'bold'
                    }}
                  />
                  {stream.isPremium && (
                    <Chip
                      label="PREMIUM"
                      size="small"
                      color="primary"
                      sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10,
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Box>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {stream.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stream.description}
                  </Typography>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      mt: 1
                    }}
                  >
                    <Typography variant="caption" color="text.secondary">
                      {stream.viewerCount.toLocaleString()} watching
                    </Typography>
                    <Chip 
                      label={stream.category} 
                      size="small" 
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

// App.jsx - Main Router Setup
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LiveStreamsPage } from './LiveStreamsPage';
import { LiveStreamPlayer } from './LiveStreamPlayer';
import { Box, AppBar, Toolbar, Typography, Container, Button } from '@mui/material';

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

const WatchPage = () => {
  // Extract streamId from URL
  const streamId = window.location.pathname.split('/').pop();
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <LiveStreamPlayer streamId={streamId} />
      {/* Additional content like chat, match details, etc. can be added here */}
    </Container>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                YourStreamApp
              </Typography>
              <Button color="inherit" component={Link} to="/">Live</Button>
              <Button color="inherit" component={Link} to="/sports">Sports</Button>
              <Button color="inherit" component={Link} to="/account">My Account</Button>
            </Toolbar>
          </AppBar>
          
          <Routes>
            <Route path="/" element={<LiveStreamsPage />} />
            <Route path="/watch/:streamId" element={<WatchPage />} />
            {/* Add more routes as needed */}
          </Routes>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
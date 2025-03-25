import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CircularProgress,
  Container,
  Divider,
  Button,
  Alert,
  Snackbar,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { PlayArrow, Info, Favorite, AccessTime, History as HistoryIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMediaUrl } from '../config/getMediaUrl';
import { motion } from 'framer-motion';
import axios from 'axios';
import { getEnvConfig } from '../config/envConfig';

const url = getEnvConfig.get("backendURI");

const MyList = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchData(activeTab);
    } else {
      setError('You need to login to view your collections');
    }
  }, [isAuthenticated, activeTab]);

  const fetchData = async (tabIndex) => {
    try {
      setLoading(true);
      let response;
      
      switch (tabIndex) {
        case 0: // All
          const [favResponse, watchResponse, historyResponse] = await Promise.all([
            axios.get(`${url}/user/favorites`, { withCredentials: true }),
            axios.get(`${url}/user/watch-later`, { withCredentials: true }),
            axios.get(`${url}/user/history`, { withCredentials: true })
          ]);
          
          const allItems = [];
          
          if (favResponse.data.success) {
            favResponse.data.data.forEach(item => {
              allItems.push({ ...item, type: 'favorite' });
            });
          }
          
          if (watchResponse.data.success) {
            watchResponse.data.data.forEach(item => {
              allItems.push({ ...item, type: 'watchLater' });
            });
          }
          
          if (historyResponse.data.success) {
            historyResponse.data.data.forEach(item => {
              if (!allItems.some(existing => existing.media?._id === item.media?._id)) {
                allItems.push({ ...item, type: 'history' });
              }
            });
          }
          
          setMediaItems(allItems);
          break;
          
        case 1: // Favorites
          response = await axios.get(`${url}/user/favorites`, { withCredentials: true });
          if (response.data.success) {
            setMediaItems(response.data.data.map(item => ({ ...item, type: 'favorite' })));
          } else {
            setError('Failed to fetch favorites');
          }
          break;
          
        case 2: // Watch Later
          response = await axios.get(`${url}/user/watch-later`, { withCredentials: true });
          if (response.data.success) {
            setMediaItems(response.data.data.map(item => ({ ...item, type: 'watchLater' })));
          } else {
            setError('Failed to fetch watch later items');
          }
          break;
          
        case 3: // History
          response = await axios.get(`${url}/user/history`, { withCredentials: true });
          if (response.data.success) {
            setMediaItems(response.data.data.map(item => ({ ...item, type: 'history' })));
          } else {
            setError('Failed to fetch history items');
          }
          break;
          
        default:
          break;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('An error occurred while fetching your collection');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handlePlayClick = (mediaId, watchProgress = 0) => {
    navigate(`/media/${mediaId}/watch`, {
      state: { startTime: watchProgress }
    });
  };

  const handleDetailsClick = (mediaId) => {
    navigate(`/media/${mediaId}`);
  };

  const getCollectionIcon = (type) => {
    switch (type) {
      case 'favorite':
        return <Favorite fontSize="small" sx={{ color: 'error.main' }} />;
      case 'watchLater':
        return <AccessTime fontSize="small" sx={{ color: 'info.main' }} />;
      case 'history':
        return <HistoryIcon fontSize="small" sx={{ color: 'success.main' }} />;
      default:
        return null;
    }
  };

  const getCollectionColor = (type) => {
    switch (type) {
      case 'favorite':
        return 'error';
      case 'watchLater':
        return 'info';
      case 'history':
        return 'success';
      default:
        return 'default';
    }
  };

  const getCollectionName = (type) => {
    switch (type) {
      case 'favorite':
        return 'Favorite';
      case 'watchLater':
        return 'Watch Later';
      case 'history':
        return 'History';
      default:
        return '';
    }
  };

  const closeFeedback = () => {
    setFeedback({ ...feedback, open: false });
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, mt: 8, minHeight: 'calc(100vh - 250px)' }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            py: 8,
            textAlign: 'center'
          }}
        >
          <Typography variant="h5" gutterBottom>Please login to view your collections</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3 }}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 8, minHeight: 'calc(100vh - 200px)' }}>
      <Typography 
        variant="h4" 
        component="h1" 
        color="white" 
        sx={{
          fontWeight: 700,
          letterSpacing: '0.5px',
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          pl: 2,
          mb: 3
        }}
      >
        My Collections
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              color: 'text.secondary',
              '&.Mui-selected': {
                color: 'primary.main',
                fontWeight: 'bold'
              }
            }
          }}
        >
          <Tab label="All" />
          <Tab label="Favorites" />
          <Tab label="Watch Later" />
          <Tab label="History" />
        </Tabs>
      </Box>
      
      <Divider sx={{ mb: 4, opacity: 0.3 }} />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress color="primary" />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>
      ) : mediaItems.length > 0 ? (
        <Grid container spacing={3}>
          {mediaItems.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={`${item.media?._id}-${item.type}-${index}`}>
              <Card 
                component={motion.div}
                whileHover={{ 
                  scale: 1.03,
                  transition: { duration: 0.2 }
                }}
                sx={{ 
                  bgcolor: '#1a1a1a', 
                  height: '100%',
                  borderRadius: 2,
                  overflow: 'hidden',
                  position: 'relative',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
                  '&:hover .media-info': {
                    opacity: 1
                  }
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height={320}
                    image={getMediaUrl(item.media?.posterUrl, 'poster')}
                    alt={item.media?.title}
                    sx={{ 
                      borderRadius: '8px 8px 0 0',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                  
                  {/* Collection type badge */}
                  <Chip
                    icon={getCollectionIcon(item.type)}
                    label={getCollectionName(item.type)}
                    color={getCollectionColor(item.type)}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      fontWeight: 'bold'
                    }}
                  />
                  
                  {/* Overlay info on hover */}
                  <Box 
                    className="media-info"
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      p: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<PlayArrow />}
                        onClick={() => handlePlayClick(
                          item.media?._id, 
                          item.type === 'history' ? item.watchProgress : 0
                        )}
                      >
                        {item.type === 'history' && item.watchProgress > 0 ? 'Continue' : 'Play'}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        startIcon={<Info />}
                        onClick={() => handleDetailsClick(item.media?._id)}
                        sx={{ borderColor: 'white', color: 'white' }}
                      >
                        Details
                      </Button>
                    </Box>
                    <Typography variant="body2" textAlign="center" sx={{ mb: 2 }}>
                      {item.media?.plot?.substring(0, 100)}...
                    </Typography>
                  </Box>
                </Box>
                
                <CardContent>
                  <Typography variant="h6" component="div" noWrap>
                    {item.media?.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.media?.year} • {item.media?.type}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ py: 8, textAlign: 'center' }}>
          <Typography variant="h6">
            {activeTab === 0 
              ? 'Your collections are empty' 
              : activeTab === 1 
                ? 'You have no favorites yet' 
                : activeTab === 2 
                  ? 'Your watch later list is empty' 
                  : 'Your watch history is empty'}
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            {activeTab === 0 
              ? 'Start exploring and adding content to your collections' 
              : activeTab === 1 
                ? 'Add your favorite movies and shows' 
                : activeTab === 2 
                  ? 'Add content to watch later' 
                  : 'Start watching content to build your history'}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 3 }}
            onClick={() => navigate('/movies')}
          >
            Browse Content
          </Button>
        </Box>
      )}
      
      <Snackbar 
        open={feedback.open} 
        autoHideDuration={3000} 
        onClose={closeFeedback}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={closeFeedback} 
          severity={feedback.severity} 
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default MyList; 
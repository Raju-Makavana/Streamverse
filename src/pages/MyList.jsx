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
import { PlayArrow, Info, Favorite, AccessTime, AccessTime as AccessTimeIcon, History as HistoryIcon,Favorite as FavoriteIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMediaUrl } from '../config/getMediaUrl';
import { motion } from 'framer-motion';
import axios from 'axios';
import { getEnvConfig } from '../config/envConfig';
import { getLikedMedia } from '../apis/likeApis';
import Favorites from './Favorites';
import WatchLater from './WatchLater';
import History from './History';

const url = getEnvConfig.get("backendURI");

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`list-tabpanel-${index}`}
      aria-labelledby={`list-tab-${index}`}
      {...other}
      style={{ minHeight: 'calc(100vh - 250px)' }}
    >
      {value === index && children}
    </div>
  );
}

const MyList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // Get the initial tab from the URL hash or default to 0
  const [value, setValue] = useState(() => {
    const hash = location.hash.replace('#', '');
    switch (hash) {
      case 'watchlater':
        return 1;
      case 'history':
        return 2;
      default:
        return 0;
    }
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
    // Update URL hash based on selected tab
    switch (newValue) {
      case 1:
        navigate('#watchlater');
        break;
      case 2:
        navigate('#history');
        break;
      default:
        navigate('#favorites');
    }
  };

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
      fetchData(value);
    } else {
      setError('You need to login to view your collections');
    }
  }, [isAuthenticated, value]);

  const fetchData = async (tabIndex) => {
    try {
      setLoading(true);
      let response;
      
      switch (tabIndex) {
        case 0: // All
          const [favResponse, watchResponse, historyResponse, likesResponse] = await Promise.all([
            axios.get(`${url}/user/favorites`, { withCredentials: true }),
            axios.get(`${url}/user/watch-later`, { withCredentials: true }),
            axios.get(`${url}/user/history`, { withCredentials: true }),
            getLikedMedia()
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

          if (likesResponse.success) {
            likesResponse.data.forEach(item => {
              if (!allItems.some(existing => existing.media?._id === item.media?._id)) {
                allItems.push({ ...item, type: 'like' });
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

        case 4: // Likes
          response = await getLikedMedia();
          if (response.success) {
            setMediaItems(response.data.map(item => ({ ...item, type: 'like' })));
          } else {
            setError('Failed to fetch liked items');
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
      case 'like':
        return <Favorite fontSize="small" sx={{ color: 'primary.main' }} />;
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
      case 'like':
        return 'primary';
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
      case 'like':
        return 'Likes';
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
    <Box sx={{ width: '100%', mt: 8 }}>
      <Container maxWidth="xl">
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
          My Lists
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={value} 
            onChange={handleChange} 
            aria-label="my lists tabs"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              '& .MuiTab-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: 'primary.main'
                }
              }
            }}
          >
            <Tab 
              icon={<FavoriteIcon />} 
              label="Favorites" 
              id="list-tab-0"
              aria-controls="list-tabpanel-0"
            />
            <Tab 
              icon={<AccessTimeIcon />} 
              label="Watch Later" 
              id="list-tab-1"
              aria-controls="list-tabpanel-1"
            />
            <Tab 
              icon={<HistoryIcon />} 
              label="History" 
              id="list-tab-2"
              aria-controls="list-tabpanel-2"
            />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <Favorites />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <WatchLater />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <History />
        </TabPanel>
      </Container>
      
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
    </Box>
  );
};

export default MyList; 
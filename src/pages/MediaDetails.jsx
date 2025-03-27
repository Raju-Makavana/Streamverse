import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  IconButton,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
  Tooltip,
  Snackbar,
  Alert
} from '@mui/material';
import {
  PlayArrow,
  Add,
  Share,
  ArrowBack,
  Star,
  Favorite,
  FavoriteBorder,
  Bookmark,
  BookmarkBorder,
  ThumbUp
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getMediaUrl } from '../config/getMediaUrl';
import { 
  fetchMediaDetailsApi, 
  getRelatedMediaApi,
  addToWatchLater,
  removeFromWatchLater,
  addToFavorites,
  removeFromFavorites,
  checkMediaInUserLists
} from '../apis/mediaApis';
import { addLike, removeLike, checkLikeStatus, getLikeCount } from '../apis/likeApis';
import CustomLoader from '../components/CustomLoader';
import AuthDialog from '../components/AuthDialog';
import { styled } from '@mui/material/styles';

const MediaDetailsPage = () => {
  const navigate = useNavigate();
  const { mediaId } = useParams();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [media, setmedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [relatedMedia, setRelatedMedia] = useState([]);
  const [userLists, setUserLists] = useState({
    inWatchLater: false,
    inFavorites: false
  });
  const [feedback, setFeedback] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authDialogMessage, setAuthDialogMessage] = useState('');
  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [mediaId]);

  useEffect(() => {
    fetchModiaDetails();
    if (isAuthenticated) {
      checkUserLists();
    }
    if (mediaId) {
      fetchLikeInfo();
    }
  }, [mediaId, isAuthenticated]);

  const fetchModiaDetails = async () => {
    try {
      setLoading(true);
      const response = await fetchMediaDetailsApi(mediaId);
      if (response.success !== false) {
        setmedia(response.data);
        fetchRelatedMedia(mediaId);
      }
    } catch (error) {
      console.error('Error fetching media details:', error);
    } finally {
      setLoading(false);
    }
  };    

  const fetchRelatedMedia = async (mediaId) => {
    try {
      const response = await getRelatedMediaApi(mediaId);
      if (response.success) {
        setRelatedMedia(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching related media:', error);
    }
  };

  const checkUserLists = async () => {
    if (!isAuthenticated) return;
    
    try {
      const response = await checkMediaInUserLists(mediaId);
      if (response.success) {
        setUserLists(response.data);
      }
    } catch (error) {
      console.error('Error checking user lists:', error);
    }
  };

  const fetchLikeInfo = async () => {
    const [likeStatusRes, likeCountRes] = await Promise.all([
      isAuthenticated ? checkLikeStatus(mediaId) : { success: false, isLiked: false },
      getLikeCount(mediaId)
    ]);

    if (likeStatusRes.success) {
      setIsLiked(likeStatusRes.isLiked);
    }

    if (likeCountRes.success) {
      setLikeCount(likeCountRes.count);
    }
  };

  const handlePlayClick = () => {
    navigate(`/media/${mediaId}/watch`);
  };

  const handleToggleWatchLater = async () => {
    if (!isAuthenticated) {
      setAuthDialogMessage('Please login to add items to your Watch Later list');
      setShowAuthDialog(true);
      return;
    }
    
    try {
      let response;
      if (userLists.inWatchLater) {
        response = await removeFromWatchLater(mediaId);
        if (response.success) {
          setUserLists({ ...userLists, inWatchLater: false });
          setFeedback({
            open: true,
            message: 'Removed from Watch Later',
            severity: 'success'
          });
        }
      } else {
        response = await addToWatchLater(mediaId);
        if (response.success) {
          setUserLists({ ...userLists, inWatchLater: true });
          setFeedback({
            open: true,
            message: 'Added to Watch Later',
            severity: 'success'
          });
        }
      }
    } catch (error) {
      console.error('Error toggling watch later:', error);
      setFeedback({
        open: true,
        message: 'Failed to update Watch Later',
        severity: 'error'
      });
    }
  };

  const handleToggleFavorites = async () => {
    if (!isAuthenticated) {
      setAuthDialogMessage('Please login to add items to your Favorites');
      setShowAuthDialog(true);
      return;
    }
    
    try {
      let response;
      if (userLists.inFavorites) {
        response = await removeFromFavorites(mediaId);
        if (response.success) {
          setUserLists({ ...userLists, inFavorites: false });
          setFeedback({
            open: true,
            message: 'Removed from Favorites',
            severity: 'success'
          });
        }
      } else {
        response = await addToFavorites(mediaId);
        if (response.success) {
          setUserLists({ ...userLists, inFavorites: true });
          setFeedback({
            open: true,
            message: 'Added to Favorites',
            severity: 'success'
          });
        }
      }
    } catch (error) {
      console.error('Error toggling favorites:', error);
      setFeedback({
        open: true,
        message: 'Failed to update Favorites',
        severity: 'error'
      });
    }
  };

  const handleToggleLike = async () => {
    if (!isAuthenticated) {
      setAuthDialogMessage('Please login to like this content');
      setShowAuthDialog(true);
      return;
    }
    
    try {
      let response;
      if (isLiked) {
        response = await removeLike(mediaId);
        if (response.success) {
          setIsLiked(false);
          setLikeCount(prev => Math.max(0, prev - 1));
          setFeedback({
            open: true,
            message: 'Removed from Likes',
            severity: 'success'
          });
        }
      } else {
        response = await addLike(mediaId);
        if (response.success) {
          setIsLiked(true);
          setLikeCount(prev => prev + 1);
          setFeedback({
            open: true,
            message: 'Added to Likes',
            severity: 'success'
          });
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setFeedback({
        open: true,
        message: 'Failed to update like status',
        severity: 'error'
      });
    }
  };

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: media.title,
        text: media.plot,
        url: window.location.href,
      })
      .catch(error => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          setFeedback({
            open: true,
            message: 'Link copied to clipboard!',
            severity: 'success'
          });
        })
        .catch(error => {
          console.error('Error copying link:', error);
          setFeedback({
            open: true,
            message: 'Failed to copy link',
            severity: 'error'
          });
        });
    }
  };

  const handleCloseAuthDialog = () => {
    setShowAuthDialog(false);
  };

  const handleCloseFeedback = () => {
    setFeedback({ ...feedback, open: false });
  };

  if (loading) {
    return <CustomLoader />;
  }

  if (!media) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100%',
          bgcolor: 'background.default',
          overflow: 'hidden'
        }}
      >
        <Typography variant="h5" color="text.primary">
          Media not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', width: '100%', overflowX: 'hidden'}}>
      {/* Hero Section - Full Screen */}
      <Box sx={{ position: 'relative', height: '90vh', width: 'calc(100vw - 17px)', overflowX: 'hidden' }}>
        {/* Background Image */}
        <Box
          component="img"
          src={getMediaUrl(media.posterUrl, 'poster')}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            maxWidth: '100%'
          }}
        />
        
        {/* Enhanced Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,1) 100%)',
            zIndex: 1,
          }}
        />

        {/* Back Button */}
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            position: 'absolute',
            top: 20,
            left: 20,
            color: 'white',
            bgcolor: 'rgba(0,0,0,0.5)',
            zIndex: 2,
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.7)',
            },
          }}
        >
          <ArrowBack />
        </IconButton>

        {/* Media Info */}
        <Container
          sx={{
            position: 'absolute',
            bottom: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        >
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              color: 'white', 
              mb: 2,
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {media.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            {media.imdb?.rating && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Star sx={{ color: '#ffd700', mr: 0.5 }} />
                <Typography color="white" sx={{ fontWeight: 'medium' }}>
                  {media.imdb.rating}/10
                </Typography>
              </Box>
            )}
            <Typography color="white">•</Typography>
            <Typography color="white" sx={{ fontWeight: 'medium' }}>{media.year}</Typography>
            <Typography color="white">•</Typography>
            <Typography color="white" sx={{ fontWeight: 'medium' }}>{media.runtime} min</Typography>
          </Box>

          <Typography
            variant="body1"
            sx={{ 
              color: 'white', 
              maxWidth: '600px', 
              mb: 4,
              fontSize: '1.1rem',
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {media.plot}
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={handlePlayClick}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                fontWeight: 'bold',
              }}
            >
              Watch Now
            </Button>
            
            <Tooltip title={userLists.inWatchLater ? "Remove from Watch Later" : "Add to Watch Later"}>
              <Button
                variant="outlined"
                startIcon={userLists.inWatchLater ? <Bookmark /> : <BookmarkBorder />}
                onClick={handleToggleWatchLater}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'primary.light',
                    bgcolor: 'rgba(229,9,20,0.1)',
                  },
                  px: 3,
                  py: 1.5,
                }}
              >
                {userLists.inWatchLater ? "In Watch Later" : "Watch Later"}
              </Button>
            </Tooltip>
            
            <Tooltip title={userLists.inFavorites ? "Remove from Favorites" : "Add to Favorites"}>
              <Button
                variant={userLists.inFavorites ? "contained" : "outlined"}
                startIcon={<Favorite />}
                onClick={handleToggleFavorites}
                color="error"
              >
                {userLists.inFavorites ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            </Tooltip>
            
            <Tooltip title="Like">
              <Button
                variant={isLiked ? "contained" : "outlined"}
                startIcon={<ThumbUp />}
                onClick={handleToggleLike}
                color="primary"
              >
                {isLiked ? "Unlike" : "Like"} ({likeCount})
              </Button>
            </Tooltip>
            
            <Tooltip title="Share">
              <IconButton
                onClick={handleShareClick}
                sx={{
                  color: 'white',
                  border: '1px solid white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                  p: 1.5,
                }}
              >
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
        </Container>
      </Box>

      {/* Media Details */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" color="white" sx={{ 
              mb: 3, 
              fontWeight: 'bold',
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 2
            }}>
              About {media.title}
            </Typography>
            <Typography color="white" sx={{ mb: 4, fontSize: '1.1rem', lineHeight: 1.7 }}>
              {media.fullplot || media.plot}
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Typography color="grey.400" sx={{ mb: 1, fontSize: '1.1rem' }}>Cast</Typography>
                <Typography color="white" sx={{ fontSize: '1.1rem' }}>
                  {media.cast?.join(', ') || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography color="grey.400" sx={{ mb: 1, fontSize: '1.1rem' }}>Director</Typography>
                <Typography color="white" sx={{ fontSize: '1.1rem' }}>
                  {media.directors?.join(', ') || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography color="grey.400" sx={{ mb: 1, fontSize: '1.1rem' }}>Genre</Typography>
                <Typography color="white" sx={{ fontSize: '1.1rem' }}>
                  {media.genres?.join(', ') || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography color="grey.400" sx={{ mb: 1, fontSize: '1.1rem' }}>Awards</Typography>
                <Typography color="white" sx={{ fontSize: '1.1rem' }}>
                  {media.awards?.text || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>

      {/* Similar Media */}
      <Container sx={{ py: 6 }}>
        <Typography 
          variant="h4" 
          color="white" 
          sx={{ 
            mb: 4, 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            '&::before': {
              content: '""',
              width: 4,
              height: 32,
              backgroundColor: 'primary.main',
              borderRadius: 2,
            }
          }}
        >
          More Like This
        </Typography>
        <Grid container spacing={3}>
          {relatedMedia.length > 0 ? (
            relatedMedia.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={item._id}>
                <motion.div 
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  <MediaCard onClick={() => navigate(`/media/${item._id}`)}>
                    <CardMedia
                      component="img"
                      image={getMediaUrl(item.posterUrl, 'poster')}
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
                          mb: 0.5,
                          color: 'text.primary'
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {item.imdb?.rating && (
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Star sx={{ color: '#ffd700', fontSize: '1rem', mr: 0.5 }} />
                            <Typography 
                              variant="body2" 
                              color="text.secondary"
                              sx={{ 
                                fontSize: '0.875rem',
                                opacity: 0.7
                              }}
                            >
                              {item.imdb.rating}
                            </Typography>
                          </Box>
                        )}
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: '0.875rem',
                            opacity: 0.7
                          }}
                        >
                          {item.year}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            fontSize: '0.875rem',
                            opacity: 0.7
                          }}
                        >
                          {item.runtime} min
                        </Typography>
                      </Box>
                    </CardContent>
                  </MediaCard>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ 
                  textAlign: 'center',
                  py: 4
                }}
              >
                No similar content found
              </Typography>
            </Grid>
          )}
        </Grid>
      </Container>
      
      <Snackbar 
        open={feedback.open} 
        autoHideDuration={3000} 
        onClose={handleCloseFeedback}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseFeedback} 
          severity={feedback.severity} 
          sx={{ width: '100%' }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>

      <AuthDialog
        open={showAuthDialog}
        onClose={handleCloseAuthDialog}
        message={authDialogMessage}
      />
    </Box>
  );
};

const MediaCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 1.5,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
    '& .card-overlay': {
      opacity: 1,
    },
    '& .card-content': {
      transform: 'translateY(-4px)',
    },
  },
}));

const CardOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 1,
}));

export default MediaDetailsPage;
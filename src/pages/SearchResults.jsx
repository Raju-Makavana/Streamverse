import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Container,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { Search as SearchIcon, FilterList, Movie, Tv, Clear, Mic as MicIcon, MicOff as MicOffIcon, Close as CloseIcon } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { searchMediaApi } from '../apis/mediaApis';
import { getMediaUrl } from '../config/getMediaUrl';
import { motion } from 'framer-motion';

const SearchResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Parse query params
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('q') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [relatedResults, setRelatedResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);
  const [showAllContent, setShowAllContent] = useState(!initialQuery);
  
  // Voice search states
  const [isListening, setIsListening] = useState(false);
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);
  const recognitionRef = useRef(null);

  // Filter states
  const [filters, setFilters] = useState({
    type: '',
    genre: '',
    year: '',
    language: ''
  });
  
  // Available filter options (would be dynamic in real app)
  const typeOptions = ['movie', 'tvshow', 'documentary', 'sports', 'news'];
  const genreOptions = ['action', 'comedy', 'drama', 'thriller', 'sci-fi', 'horror', 'romance', 'adventure'];
  const yearOptions = [...Array(2024 - 1990 + 1).keys()].map(i => String(2024 - i));
  const languageOptions = ['English', 'Spanish', 'Hindi', 'French', 'German', 'Japanese', 'Korean', 'Chinese'];
  
  // Voice search initialization
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
          
        setSearchQuery(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (searchQuery.trim().length >= 2) {
          setVoiceDialogOpen(false);
          
          // Update URL with voice search query
          const searchParams = new URLSearchParams(location.search);
          searchParams.set('q', searchQuery);
          navigate(`${location.pathname}?${searchParams.toString()}`);
          
          performSearch();
        } else {
          setVoiceDialogOpen(false);
          // If search query is too short, show all content
          if (searchQuery.trim().length > 0) {
            // Clear the search query from URL
            const searchParams = new URLSearchParams(location.search);
            searchParams.delete('q');
            navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
          }
          loadAllMedia();
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        
        // Show error message based on the error type
        if (event.error === 'not-allowed') {
          alert('Microphone access was denied. Please enable microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          // No need to alert, just close dialog after a delay
          setTimeout(() => setVoiceDialogOpen(false), 1500);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [searchQuery]);
  
  useEffect(() => {
    if (initialQuery) {
      performSearch();
    } else {
      // If no search query is provided, load all media
      loadAllMedia();
    }
  }, [initialQuery, page, filters]);
  
  const loadAllMedia = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowAllContent(true);
      
      // Prepare search parameters without a query
      const searchParams = {
        page,
        limit: 24,
        ...filters
      };
      
      const result = await searchMediaApi(searchParams);
      
      if (result.success) {
        setResults(result.data || []);
        setTotalResults(result.count || 0);
        setTotalPages(result.totalPages || Math.ceil(result.count / 24));
      } else {
        setError(result.error || 'Failed to fetch media');
        setResults([]);
        setTotalResults(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Error loading media:', error);
      setError('An error occurred while loading media');
      setResults([]);
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };
  
  const performSearch = async () => {
    if (!searchQuery.trim()) {
      loadAllMedia();
      return;
    }
    
    setShowAllContent(false);
    
    try {
      setLoading(true);
      setError(null);
      
      // Update URL with search query
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('q', searchQuery);
      navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
      
      // Prepare search parameters
      const searchParams2 = {
        query: searchQuery,
        page,
        limit: 24,
        ...filters
      };
      
      const result = await searchMediaApi(searchParams2);
      
      if (result.success) {
        setResults(result.data || []);
        setRelatedResults(result.related || []);
        setTotalResults(result.count || 0);
        setTotalPages(result.totalPages || Math.ceil(result.count / 24));
      } else {
        setError(result.error || 'Failed to fetch search results');
        setResults([]);
        setRelatedResults([]);
        setTotalResults(0);
        setTotalPages(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred while searching');
      setResults([]);
      setRelatedResults([]);
      setTotalResults(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  };
  
  // Voice search methods
  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.');
      return;
    }
    
    try {
      setVoiceDialogOpen(true);
      setIsListening(true);
      recognitionRef.current.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
      setVoiceDialogOpen(false);
      alert('Failed to start speech recognition. Please try again.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      setIsListening(false);
      recognitionRef.current.stop();
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };
  
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      type: '',
      genre: '',
      year: '',
      language: ''
    });
  };
  
  const handleMediaClick = (mediaId) => {
    navigate(`/media/${mediaId}`);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, mt: 8 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        color="white" 
        mb={3}
        sx={{
          fontWeight: 700,
          letterSpacing: '0.5px',
          borderLeft: '4px solid',
          borderColor: 'primary.main',
          pl: 2
        }}
      >
        {searchQuery ? `Search Results: "${searchQuery}"` : 'Browse All Content'}
      </Typography>
      
      {/* Search Form */}
      <Box 
        component="form" 
        onSubmit={handleSearchSubmit} 
        mb={4}
        sx={{
          backgroundColor: 'background.paper',
          p: 3,
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={startListening}>
                      <MicIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={6} sm={3} md={1.5}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                label="Type"
              >
                <MenuItem value="">Any</MenuItem>
                {typeOptions.map(type => (
                  <MenuItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} sm={3} md={1.5}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Genre</InputLabel>
              <Select
                value={filters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                label="Genre"
              >
                <MenuItem value="">Any</MenuItem>
                {genreOptions.map(genre => (
                  <MenuItem key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} sm={3} md={1.5}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Year</InputLabel>
              <Select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                label="Year"
              >
                <MenuItem value="">Any</MenuItem>
                {yearOptions.map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} sm={3} md={1.5}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Language</InputLabel>
              <Select
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                label="Language"
              >
                <MenuItem value="">Any</MenuItem>
                {languageOptions.map(lang => (
                  <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
          <IconButton onClick={clearFilters} sx={{ color: 'text.secondary' }}>
            <Clear />
          </IconButton>
          <IconButton type="submit" color="primary">
            <FilterList />
          </IconButton>
        </Box>
      </Box>
      
      {/* Results */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      ) : (
        <>
          {results.length > 0 && (
            <>
              <Typography variant="h5" color="white" mb={3}>
                {showAllContent ? 'All Content' : `Search Results (${totalResults})`}
              </Typography>
              <Grid container spacing={3}>
                {results.map((media) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={media._id}>
                    <Card 
                      component={motion.div}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      sx={{ 
                        bgcolor: '#1a1a1a', 
                        height: '100%',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.03)',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
                        position: 'relative',
                        maxWidth: '100%',
                        '&:hover': {
                          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                          '& .MuiCardMedia-root': {
                            transform: 'scale(1.05)'
                          }
                        }
                      }}
                      onClick={() => handleMediaClick(media._id)}
                    >
                      <Box sx={{ position: 'relative', pt: '150%' /* 2:3 aspect ratio */ }}>
                        <CardMedia
                          component="img"
                          image={getMediaUrl(media.posterUrl || media.thumbnail, 'poster')}
                          alt={media.title}
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 'medium' }}>
                          {media.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {media.year}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              {/* Pagination */}
              {totalResults > 24 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, value) => setPage(value)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}

          {relatedResults.length > 0 && (
            <Box sx={{ mt: 6 }}>
              <Typography variant="h5" color="white" mb={3}>
                Related Content
              </Typography>
              <Grid container spacing={3}>
                {relatedResults.map((media) => (
                  <Grid item xs={6} sm={4} md={3} lg={2} key={media._id}>
                    <Card 
                      component={motion.div}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      sx={{ 
                        bgcolor: '#1a1a1a', 
                        height: '100%',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.03)',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
                        position: 'relative',
                        maxWidth: '100%',
                        '&:hover': {
                          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                          '& .MuiCardMedia-root': {
                            transform: 'scale(1.05)'
                          }
                        }
                      }}
                      onClick={() => handleMediaClick(media._id)}
                    >
                      <Box sx={{ position: 'relative', pt: '150%' /* 2:3 aspect ratio */ }}>
                        <CardMedia
                          component="img"
                          image={getMediaUrl(media.posterUrl || media.thumbnail, 'poster')}
                          alt={media.title}
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease'
                          }}
                        />
                      </Box>
                      <CardContent sx={{ flexGrow: 1, p: 1.5 }}>
                        <Typography variant="subtitle1" noWrap sx={{ fontWeight: 'medium' }}>
                          {media.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {media.year}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {!loading && results.length === 0 && !error && (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No results found for "{searchQuery}"
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Voice Search Dialog */}
      <Dialog 
        open={voiceDialogOpen} 
        onClose={() => {
          stopListening();
          setVoiceDialogOpen(false);
        }}
        TransitionProps={{
          onExited: () => {
            // Clean up when dialog is fully closed
            if (isListening) {
              stopListening();
            }
          }
        }}
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white',
            borderRadius: 2,
            minWidth: 300,
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>
          Voice Search
          <IconButton
            aria-label="close"
            onClick={() => {
              stopListening();
              setVoiceDialogOpen(false);
            }}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 3 }}>
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              my: 3,
              p: 2,
              borderRadius: '50%',
              bgcolor: isListening ? 'primary.main' : 'rgba(255,255,255,0.1)',
              width: 80,
              height: 80,
              transition: 'all 0.3s ease',
              boxShadow: isListening ? '0 0 15px rgba(229,9,20,0.5)' : 'none'
            }}
          >
            <IconButton 
              color="inherit" 
              onClick={isListening ? stopListening : startListening}
              sx={{ width: 50, height: 50 }}
            >
              {isListening ? <MicOffIcon fontSize="large" /> : <MicIcon fontSize="large" />}
            </IconButton>
          </Box>
          <Typography align="center" variant="body1">
            {isListening 
              ? "Listening... Speak now" 
              : "Click the microphone to start speaking"}
          </Typography>
          {isListening && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {searchQuery ? `Heard: "${searchQuery}"` : 'Waiting for speech...'}
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default SearchResults; 
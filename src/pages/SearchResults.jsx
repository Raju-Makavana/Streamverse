import React, { useState, useEffect } from 'react';
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
  Pagination
} from '@mui/material';
import { Search as SearchIcon, FilterList, Movie, Tv, Clear } from '@mui/icons-material';
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
  const [error, setError] = useState(null);
  
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
  
  useEffect(() => {
    if (initialQuery) {
      performSearch();
    }
  }, [initialQuery, page, filters]);
  
  const performSearch = async () => {
    if (!searchQuery.trim()) return;
    
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
      } else {
        setError(result.error || 'Failed to fetch search results');
        setResults([]);
        setRelatedResults([]);
        setTotalResults(0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('An error occurred while searching');
      setResults([]);
      setRelatedResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
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
        Search Results
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
                Search Results ({totalResults})
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
                        '&:hover': {
                          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                          '& .MuiCardMedia-root': {
                            transform: 'scale(1.05)'
                          }
                        }
                      }}
                      onClick={() => handleMediaClick(media._id)}
                    >
                      <CardMedia
                        component="img"
                        height="300"
                        image={getMediaUrl(media.thumbnail)}
                        alt={media.title}
                        sx={{ 
                          objectFit: 'cover',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" noWrap>
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
              
              {totalResults > 24 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={Math.ceil(totalResults / 24)}
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
                      whileHover={{ scale: 1.05 }}
                      sx={{ 
                        bgcolor: '#1a1a1a', 
                        cursor: 'pointer'
                      }}
                      onClick={() => handleMediaClick(media._id)}
                    >
                      <CardMedia
                        component="img"
                        height="300"
                        image={getMediaUrl(media.thumbnail)}
                        alt={media.title}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" noWrap>
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
    </Container>
  );
};

export default SearchResults; 
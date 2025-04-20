import React, { useState, useRef, useEffect } from 'react';
import { styled, alpha } from '@mui/material/styles';
import { 
  Box, 
  InputBase, 
  IconButton, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Chip,
  Grid,
  Divider,
  Popper,
  Grow,
  ClickAwayListener
} from '@mui/material';
import { 
  Search as SearchIcon, 
  Mic as MicIcon, 
  MicOff as MicOffIcon, 
  Movie as MovieIcon,
  Tv as TvIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { searchMediaApi } from '../apis/mediaApis';
import { getMediaUrl } from '../config/getMediaUrl';
import debounce from 'lodash/debounce';

const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
  border: '1px solid rgba(255,255,255,0.2)',
  marginLeft: 0,
  width: '100%',
  maxWidth: '500px',
  transition: 'all 0.3s ease',
  [theme.breakpoints.up('sm')]: {
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '40ch',
      },
    },
  },
}));

const SearchResultItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    cursor: 'pointer',
  },
  gap: theme.spacing(2),
}));

const GlobalSearch = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);
  const anchorRef = useRef(null);
  
  const recognitionRef = useRef(null);

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
        
        if (event.results[0].isFinal) {
          handleVoiceSearchResult(transcript);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (searchQuery && searchQuery.trim().length >= 2) {
          setVoiceDialogOpen(false);
          debouncedSearch(searchQuery);
          setShowResults(true);
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
  }, []);

  const debouncedSearch = useRef(
    debounce(async (query) => {
      if (query.trim().length < 2) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const result = await searchMediaApi({ query });
        if (result.success) {
          setSearchResults(result.data || []);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    }, 500)
  ).current;

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    if (query.trim().length >= 2) {
      setShowResults(true);
      setLoading(true);
      debouncedSearch(query);
    } else {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (event) => {
    if (event.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowResults(false);
      setSearchQuery('');
    }
  };

  const handleResultClick = (mediaId) => {
    navigate(`/media/${mediaId}`);
    setShowResults(false);
    setSearchQuery('');
  };

  const handleSearchFocus = () => {
    // Immediately navigate to search page when clicked
    navigate('/search');
    setShowResults(false);
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please try using Chrome, Edge, or Safari.');
      return;
    }
    
    setVoiceDialogOpen(true);
    setIsListening(true);
    setSearchQuery('');
    try {
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

  const handleVoiceSearchResult = (text) => {
    setSearchQuery(text);
    setVoiceDialogOpen(false);
    
    if (text && text.trim().length >= 2) {
      // Navigate to search page with voice search query
      navigate(`/search?q=${encodeURIComponent(text.trim())}`);
    } else {
      // Navigate to search page without query if text is too short
      navigate('/search');
    }
  };

  const handleClickAway = () => {
    setShowResults(false);
  };

  const getMediaTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'movie':
        return <MovieIcon fontSize="small" />;
      case 'tvshow':
        return <TvIcon fontSize="small" />;
      default:
        return <MovieIcon fontSize="small" />;
    }
  };

  return (
    <>
      <Box sx={{ position: 'relative' }}>
        <SearchWrapper 
          ref={anchorRef} 
          onClick={handleSearchFocus}
          sx={{ cursor: 'pointer' }}
        >
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search movies, shows, more..."
            inputProps={{ 'aria-label': 'search' }}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleSearchSubmit}
            onFocus={handleSearchFocus}
          />
          <IconButton
            onClick={(e) => {
              e.stopPropagation(); // Prevent click from triggering parent handler
              startListening();
            }}
            disableRipple
            disableTouchRipple
            sx={{ 
              position: 'absolute', 
              right: 0, 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            <MicIcon />
          </IconButton>
        </SearchWrapper>
      </Box>

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
    </>
  );
};

export default GlobalSearch; 
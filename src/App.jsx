import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MainLayout from '../src/section/layout/MainLayout';
import AuthLayout from '../src/section/layout/AuthLayout';
import Login from '../src/pages/Login';
import Register from '../src/pages/Register';
import Home from '../src/pages/Home';
import Movies from '../src/pages/Movies';
import TvShows from '../src/pages/TvShows';
import Profile from '../src/pages/Profile';
import Sports from './pages/Sports';
import News from './pages/News';
import MediaPlayer from './pages/MediaPlayer';
import MediaDetailsPage from './pages/MediaDetails';
import SearchResults from './pages/SearchResults';
import Favorites from './pages/Favorites';
import WatchLater from './pages/WatchLater';
import History from './pages/History';
import MyList from './pages/MyList';
import CustomLoader from './components/CustomLoader';
import ProtectedRoute from './components/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadUser } from './slices/authSlice';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { 
      main: '#e50914', 
      light: '#ff3d47',
      dark: '#b30710',
    },
    secondary: { 
      main: '#ffffff' 
    },
    background: { 
      default: '#000000',
      paper: '#141414' 
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3'
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    button: { fontWeight: 500 }
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: {
          '&:focus': {
            outline: 'none',
          }
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: 'none',
          fontWeight: 500,
          '&:focus': {
            outline: 'none',
          }
        }
      }
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: {
          '&:focus': {
            outline: 'none',
          }
        }
      }
    },
    MuiListItem: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      }
    },
    MuiListItemButton: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      }
    },
    MuiMenuItem: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      }
    },
    MuiTab: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      }
    },
    MuiAccordionSummary: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      }
    },
    MuiSwitch: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      }
    },
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      }
    },
    MuiRadio: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      }
    },
    MuiTableRow: {
      defaultProps: {
        hover: false
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#1a1a1a',
          borderRadius: 6
        }
      }
    },
    MuiChip: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 4
        }
      }
    },
    MuiLink: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      }
    },
    MuiSlider: {
      defaultProps: {
        disableRipple: true,
        disableTouchRipple: true,
      }
    }
  }
});

// console.log = function() {};
// console.error = function(){};

export default function App() {
  const dispatch = useDispatch();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { error, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  
  useEffect(() => {
    const initializeApp = async () => {
      await dispatch(loadUser());
      setIsInitialLoading(false);
    };
    
    initializeApp();
  }, [dispatch]);

  // Show loader during initial authentication check
  if (isInitialLoading) {
    return <CustomLoader />;
  }

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route element={<MainLayout />}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} /> 
            <Route path="/home" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tvshows" element={<TvShows />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/news" element={<News />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/media/:mediaId" element={<MediaDetailsPage />} />
            <Route path="/media/:mediaId/watch" element={<MediaPlayer />} />
            
            {/* Protected Routes */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/favorites" element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            } />
            <Route path="/watch-later" element={
              <ProtectedRoute>
                <WatchLater />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            } />
            <Route path="/my-list" element={
              <ProtectedRoute>
                <MyList />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}
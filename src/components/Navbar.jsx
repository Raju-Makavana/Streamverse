import React, { useState } from 'react';
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Movie as MovieIcon,
  Tv as TvIcon,
  SportsHandball as SportsIcon,
  Newspaper as NewsIcon,
  List as ListIcon,
  Favorite as FavoriteIcon,
  WatchLater as WatchLaterIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Login as LoginIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import SearchBar from './SearchBar';

const mainMenuItems = [
  { title: 'Home', icon: <HomeIcon />, path: '/home' },
  { title: 'Movies', icon: <MovieIcon />, path: '/movies' },
  { title: 'TV Shows', icon: <TvIcon />, path: '/tvshows' },
  { title: 'Sports', icon: <SportsIcon />, path: '/sports' },
  { title: 'News', icon: <NewsIcon />, path: '/news' }
];

const userMenuItems = [
  {
    title: 'My Lists',
    icon: <ListIcon />,
    path: '/my-list',
    auth: true,
    children: [
      {
        title: 'Favorites',
        icon: <FavoriteIcon />,
        path: '/my-list#favorites'
      },
      {
        title: 'Watch Later',
        icon: <WatchLaterIcon />,
        path: '/my-list#watchlater'
      },
      {
        title: 'History',
        icon: <HistoryIcon />,
        path: '/my-list#history'
      }
    ]
  },
  { title: 'Profile', icon: <PersonIcon />, path: '/profile', auth: true }
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
    await dispatch(logout());
    handleCloseUserMenu();
    navigate('/login');
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleCloseNavMenu();
    setMobileOpen(false);
  };

  const drawer = (
    <Box sx={{ width: 250 }}>
      <List>
        {mainMenuItems.map((item) => (
          <ListItem 
            button 
            key={item.title}
            onClick={() => handleMenuItemClick(item.path)}
            selected={location.pathname === item.path}
            disableRipple
            disableTouchRipple
          >
            <ListItemIcon sx={{ color: 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        {userMenuItems.map((item) => (
          !item.auth || (item.auth && isAuthenticated) ? (
            <React.Fragment key={item.title}>
              <ListItem 
                button
                onClick={() => handleMenuItemClick(item.path)}
                selected={location.pathname === item.path}
                disableRipple
                disableTouchRipple
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItem>
              {item.children && (
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItem
                      button
                      key={child.title}
                      onClick={() => handleMenuItemClick(child.path)}
                      selected={location.pathname + location.hash === child.path}
                      sx={{ pl: 4 }}
                      disableRipple
                      disableTouchRipple
                    >
                      <ListItemIcon sx={{ color: 'inherit' }}>
                        {child.icon}
                      </ListItemIcon>
                      <ListItemText primary={child.title} />
                    </ListItem>
                  ))}
                </List>
              )}
            </React.Fragment>
          ) : null
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            disableRipple
            disableTouchRipple
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'primary.main',
              textDecoration: 'none',
              flexGrow: { xs: 1, sm: 0 }
            }}
          >
            STREAMVERSE
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}>
            {mainMenuItems.map((item) => (
              <Button
                key={item.title}
                onClick={() => handleMenuItemClick(item.path)}
                disableRipple
                disableTouchRipple
                sx={{ 
                  my: 2, 
                  color: 'text.primary', 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
                startIcon={item.icon}
              >
                {item.title}
              </Button>
            ))}
          </Box>

          {/* Search Bar */}
          <SearchBar />

          {/* User Menu */}
          <Box sx={{ flexGrow: 0, ml: 2 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar 
                      alt={user?.name} 
                      src={user?.avatar?.url}
                      sx={{ bgcolor: 'primary.main' }}
                    >
                      {user?.name?.charAt(0)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={() => handleMenuItemClick('/profile')} disableRipple disableTouchRipple>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Profile</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuItemClick('/my-list')} disableRipple disableTouchRipple>
                    <ListItemIcon>
                      <ListIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">My Lists</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout} disableRipple disableTouchRipple>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="contained"
                color="primary"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            bgcolor: 'background.paper'
          },
        }}
      >
        {drawer}
      </Drawer>
    </AppBar>
  );
};

export default Navbar; 
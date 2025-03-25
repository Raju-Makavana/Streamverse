import React, { useEffect, useRef, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Box,
  Avatar,
  InputBase,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  CircularProgress,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import FavoriteIcon from "@mui/icons-material/Favorite";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import HistoryIcon from "@mui/icons-material/History";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { logoutUser } from "../../slices/authSlice";
import GlobalSearch from "../../components/GlobalSearch";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const Header = ({ onSidebarToggle }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notifAnchorEl, setNotifAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceDialogOpen, setVoiceDialogOpen] = useState(false);
  const [transcript, setTranscript] = useState("");

  const mainNavItems = [
    { text: "Home", path: "/home" },
    { text: "Movies", path: "/movies" },
    { text: "TV Shows", path: "/tvshows" },
    { text: "Sports", path: "/sports" },
    { text: "New & Popular", path: "/news" },
  ];

  const userMenuItems = [
    { text: "My List", icon: <PlaylistPlayIcon />, path: "/my-list" },
    { text: "Favorites", icon: <FavoriteIcon />, path: "/favorites" },
    { text: "Watch Later", icon: <WatchLaterIcon />, path: "/watch-later" },
    { text: "History", icon: <HistoryIcon />, path: "/history" },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotifMenuOpen = (event) => {
    setNotifAnchorEl(event.currentTarget);
  };

  const handleNotifMenuClose = () => {
    setNotifAnchorEl(null);
  };

  const recognitionRef = useRef(null);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleVoiceSearch(text);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = () => {
    setTranscript("");
    setVoiceDialogOpen(true);
    setIsListening(true);
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  const handleVoiceSearch = (text) => {
    // Implement search logic here
    console.log("Searching for:", text);
    setVoiceDialogOpen(false);
    // You can trigger the search here
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      handleMenuClose();
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Logged out successfully",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/login");
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Logout failed",
        text: "Please try again",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: "blur(10px)",
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <Toolbar>
          {/* Mobile Menu Icon */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleMobileMenu}
            sx={{ display: { md: "none" }, mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <IconButton
            color="inherit"
            onClick={() => navigate("/")}
            sx={{ p: 0, mr: 3 }}
          >
            <img src="/logo.png" alt="Logo" style={{ height: 40 }} />
          </IconButton>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {mainNavItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  color:
                    location.pathname === item.path
                      ? "primary.main"
                      : "#BFBFBF",
                  "&:hover": { color: "primary.light" },
                  fontWeight: location.pathname === item.path ? 'bold' : 'normal',
                  position: 'relative',
                  '&::after': location.pathname === item.path ? {
                    content: '""',
                    position: 'absolute',
                    bottom: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '30%',
                    height: '2px',
                    backgroundColor: 'primary.main'
                  } : {}
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Search */}
          <Box sx={{ mr: 2, display: { xs: "none", sm: "block" } }}>
            <GlobalSearch />
          </Box>

          {/* Notifications */}
          <IconButton color="inherit" onClick={handleNotifMenuOpen}>
            <Badge badgeContent={3} color="primary">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile */}
          <IconButton color="inherit" onClick={handleProfileMenuOpen}>
            <Avatar
              src={user?.avatar}
              alt={user?.name}
              sx={{ width: 32, height: 32 }}
            >
              {user?.name?.charAt(0) || "U"}
            </Avatar>
          </IconButton>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                bgcolor: "#1a1a1a",
                color: "white",
                minWidth: 200,
                mt: 1,
                boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.05)'
              },
            }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/profile");
              }}
              sx={{ py: 1 }}
            >
              <ListItemText primary={user?.name || "User"} />
            </MenuItem>
            <Divider sx={{ my: 0.5, bgcolor: "rgba(255, 255, 255, 0.1)" }} />

            {userMenuItems.map((item) => (
              <MenuItem
                key={item.path}
                onClick={() => {
                  handleMenuClose();
                  navigate(item.path);
                }}
                sx={{ py: 1 }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 36 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </MenuItem>
            ))}

            <Divider sx={{ my: 0.5, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/settings");
              }}
              sx={{ py: 1 }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 36 }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </MenuItem>
            <MenuItem onClick={handleLogout} sx={{ py: 1 }}>
              <ListItemIcon sx={{ color: "white", minWidth: 36 }}>
                <LogoutIcon sx={{ color: 'primary.main' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </Menu>

          {/* Notifications Menu */}
          <Menu
            anchorEl={notifAnchorEl}
            keepMounted
            open={Boolean(notifAnchorEl)}
            onClose={handleNotifMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                bgcolor: "#1F1F1F",
                color: "white",
                minWidth: 250,
                maxHeight: "70vh",
                mt: 1,
              },
            }}
          >
            <MenuItem
              sx={{ py: 1, borderBottom: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ListItemText primary="New movie added: Inception" secondary="2 hours ago" />
            </MenuItem>
            <MenuItem
              sx={{ py: 1, borderBottom: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ListItemText primary="New episode available: Stranger Things S4E8" secondary="Yesterday" />
            </MenuItem>
            <MenuItem>
              <ListItemText primary="Weekend special: Free premium content" secondary="2 days ago" />
            </MenuItem>
            <Divider sx={{ my: 0.5, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
            <MenuItem
              onClick={handleNotifMenuClose}
              sx={{ justifyContent: "center", color: "primary.main" }}
            >
              <ListItemText primary="See all notifications" sx={{ textAlign: "center" }} />
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{ 
          sx: { 
            bgcolor: "#0a0a0a", 
            color: "white", 
            width: 240,
            boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            border: 'none'
          } 
        }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "center",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <img src="/logo.png" alt="Logo" style={{ height: 40 }} />
        </Box>
        <Box sx={{ mt: 2, px: 1 }}>
          {/* Mobile Search */}
          <Box sx={{ px: 2, mb: 2 }}>
            <GlobalSearch />
          </Box>
          
          <List>
            {mainNavItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    toggleMobileMenu();
                  }}
                  sx={{
                    color:
                      location.pathname === item.path
                        ? "primary.main"
                        : "#BFBFBF",
                    borderRadius: "4px",
                  }}
                >
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 1, bgcolor: "rgba(255, 255, 255, 0.1)" }} />
          <List>
            {userMenuItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    toggleMobileMenu();
                  }}
                >
                  <ListItemIcon sx={{ color: "white", minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Dialog open={voiceDialogOpen} onClose={() => setVoiceDialogOpen(false)}>
        <DialogTitle>Voice Search</DialogTitle>
        <DialogContent
          sx={{
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <DialogContentText>
            {isListening
              ? "Listening... Speak now"
              : "Click the microphone to start"}
          </DialogContentText>

          <IconButton
            onClick={isListening ? stopListening : startListening}
            sx={{
              width: 80,
              height: 80,
              backgroundColor: isListening ? "error.main" : "primary.main",
              "&:hover": {
                backgroundColor: isListening ? "error.dark" : "primary.dark",
              },
            }}
          >
            {isListening ? (
              <>
                <MicOffIcon sx={{ fontSize: 40, color: "white" }} />
                <CircularProgress
                  size={90}
                  thickness={2}
                  sx={{
                    position: "absolute",
                    color: "white",
                  }}
                />
              </>
            ) : (
              <MicIcon sx={{ fontSize: 40, color: "white" }} />
            )}
          </IconButton>

          {transcript && <DialogContentText>"{transcript}"</DialogContentText>}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;

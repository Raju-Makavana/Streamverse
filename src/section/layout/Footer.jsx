import React from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Link, 
  IconButton,
  useTheme
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  const theme = useTheme();

  const footerSections = [
    {
      title: 'Company',
      links: ['About Us', 'Careers', 'Press', 'Contact']
    },
    {
      title: 'Support',
      links: ['Help Center', 'Safety Center', 'Community Guidelines']
    },
    {
      title: 'Legal',
      links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy']
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        backgroundColor: "#0F0F0F",
        borderTop: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        bottom: 0,
      }}
    >
      {/* Main Footer Content */}
      <Box
        sx={{
          maxWidth: '1200px',
          mx: 'auto',
          px: { xs: 2, sm: 4, md: 6 },
          py: 6,
        }}
      >
        <Grid container spacing={4} justifyContent="space-evenly">
          {footerSections.map((section) => (
            <Grid item xs={12} sm={4} key={section.title}>
              <Typography variant="h6" color="#FFFFFF" gutterBottom>
                {section.title}
              </Typography>
              <Box>
                {section.links.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    color="#999999"
                    display="block"
                    sx={{ 
                      mb: 1, 
                      '&:hover': { 
                        color: 'primary.main',
                        textDecoration: 'none'
                      } 
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Social Media & Copyright Section */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
            textAlign: 'center'
          }}
        >
          <Box sx={{ mb: 2 }}>
            <IconButton 
              color="primary"
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)' 
                } 
              }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton 
              color="primary"
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)' 
                } 
              }}
            >
              <TwitterIcon />
            </IconButton>
            <IconButton 
              color="primary"
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)' 
                } 
              }}
            >
              <InstagramIcon />
            </IconButton>
            <IconButton 
              color="primary"
              sx={{ 
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)' 
                } 
              }}
            >
              <YouTubeIcon />
            </IconButton>
          </Box>
          <Typography variant="body2" color="#999999">
            {'Copyright © '}
            <Link 
              color="inherit" 
              href="/"
              sx={{ 
                '&:hover': { 
                  color: 'primary.main',
                  textDecoration: 'none'
                } 
              }}
            >
              StreamVerse
            </Link>{' '}
            {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
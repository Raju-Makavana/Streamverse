import React from 'react';
import { Box, Typography, Chip, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import { Article, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getMediaUrl } from '../config/getMediaUrl';

const NewsCard = ({ news, isBreaking = false }) => {
  const navigate = useNavigate();
  
  return (
    <Box
      component={motion.div}
      whileHover={{ scale: 1.05 }}
      onClick={() => navigate(`/media/${news._id}`)}
      sx={{
        position: 'relative',
        aspectRatio: '3/2',
        borderRadius: 1,
        overflow: 'hidden',
        cursor: 'pointer',
        bgcolor: '#1a1a1a',
        width: '100%',
      }}
    >
      <Box
        component="img"
        src={getMediaUrl(news.posterUrl, 'poster')}
        alt={news.title}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/placeholder-poster.jpg';
        }}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
      
      {/* Overlay gradient and content */}
      <Box sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        p: 1,
        background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
        color: 'white',
      }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {news.title}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mt: 0.5 
        }}>
          <Typography variant="caption" sx={{ color: 'grey.300' }}>
            {news.category}
          </Typography>
          <Typography variant="caption" sx={{ color: 'grey.300' }}>
            {new Date(news.publishedAt).toLocaleDateString()}
          </Typography>
        </Box>
      </Box>

      {/* Breaking News Badge */}
      {isBreaking && (
        <Chip
          icon={<Article />}
          label="BREAKING"
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1
          }}
        />
      )}
    </Box>
  );
};

export default NewsCard;
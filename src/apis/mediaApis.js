import axios from "axios";
import { getEnvConfig } from "../config/envConfig";
const url = getEnvConfig.get("backendURI");

const blobUrlCache = new Map();

const clearBlobUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

const jsonconfig = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  
  
  const formDataconfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  };

// Sliders APIs
export const getSlidersApi = async (pageType = 'home') => {
  try {
    const { data } = await axios.get(`${url}/slider/sliders?pageType=${pageType}`, jsonconfig);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.response };
  }
};

// All Media APIs
export const getAllMediaApi = async () => {
  try {
    const { data } = await axios.get(`${url}/media`, jsonconfig);
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching all media:', error);
    return { success: false, error: error.response };
  }
};

export const getLatestMedia = async () => {
  try {
    const response = await axios.get(`${url}/media?sort=latest`, jsonconfig);
    return response.data;
  } catch (error) {
    console.error('Error fetching latest media:', error);
    return { success: false, data: [], message: error.message };
  }
};

export const getTrendingMedia = async () => {
  try {
    const response = await axios.get(`${url}/media?sort=trending`, jsonconfig);
    return response.data;
  } catch (error) {
    console.error('Error fetching trending media:', error);
    return { success: false, data: [], message: error.message };
  }
};

export const getMediaByType = async (type) => {
  try {
    const response = await axios.get(`${url}/media?type=${type}`, jsonconfig);
    return response.data;
  } catch (error) {
    console.error('Error fetching media by type:', error);
    return { success: false, data: [], message: error.message };
  }
};

export const getPopularMedia = async () => {
  try {
    const response = await axios.get(`${url}/media?sort=popular`, jsonconfig);
    return { success: true, data: response.data?.data || [] };
  } catch (error) {
    console.error('Error fetching popular media:', error);
    return { success: false, data: [], message: error.message };
  }
};

export const getFeaturedMedia = async () => {
  try {
    const response = await axios.get(`${url}/media?featured=true`, jsonconfig);
    return { success: true, data: response.data?.data || [] };
  } catch (error) {
    console.error('Error fetching featured media:', error);
    return { success: false, data: [], message: error.message };
  }
};


export const fetchMediaDetailsApi = async (mediaId) => {
  try {
    const response = await axios.get(`${url}/media/${mediaId}`, jsonconfig);
    return response.data;
  } catch (error) {
    console.error('Error fetching media details:', error);
    return { success: false, data: null, message: error.message };
  }
};

// Media Streaming API
export const getMediaStreamApi = async (mediaId, quality = '1080p') => {
  try {
    // First get media details
    const mediaDetails = await fetchMediaDetailsApi(mediaId);
    
    if (!mediaDetails.data?.videoUrl?.resolutions) {
      throw new Error('No video resolutions available');
    }

    return {
      success: true,
      data: mediaDetails.data
    };
  } catch (error) {
    console.error('Error fetching media stream:', error);
    throw error;
  }
};

// Get all movies
export const getAllMoviesApi = async () => {
  try {
    const response = await axios.get(`${url}/mediaprovider/movies`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all movies:", error);
    return { success: false, error: error.message };
  }
};

// Get featured movies for banner
export const getFeaturedMoviesApi = async (params = {}) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/featured`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching featured movies:", error);
    return { success: false, error: error.message };
  }
};

// Get latest movies
export const getLatestMoviesApi = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/latest`, {
      params: { page, limit }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching latest movies:", error);
    return { success: false, error: error.message };
  }
};

// Get trending movies
export const getTrendingMoviesApi = async (minRating = 7, limit = 10) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/trending`, {
      params: { minRating, limit }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return { success: false, error: error.message };
  }
};

// Get popular movies
export const getPopularMoviesApi = async (minVotes = 1000, limit = 10) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/popular`, {
      params: { minVotes, limit }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return { success: false, error: error.message };
  }
};

// Get movies by genre
export const getMoviesByGenreApi = async (genre, limit = 10) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/genre/${genre}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${genre} movies:`, error);
    return { success: false, error: error.message };
  }
};

// Get movie by ID
export const getMovieByIdApi = async (id) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return { success: false, error: error.message };
  }
};

// TV Shows API functions to work with Media collection
export const getTvShowsByCategory = async (category, limit = 10) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/tvshows`, {
      params: {
        genre: category,
        limit,
        type: 'tvshow'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching TV shows by category:', error);
    return { success: false, error: error.message };
  }
};

export const getLatestTvShows = async (limit = 10) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/tvshows/latest`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching latest TV shows:', error);
    return { success: false, error: error.message };
  }
};

export const getTrendingTvShows = async (limit = 10) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/tvshows/trending`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending TV shows:', error);
    return { success: false, error: error.message };
  }
};

export const getPopularTvShows = async (limit = 10) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/tvshows/popular`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular TV shows:', error);
    return { success: false, error: error.message };
  }
};

// Sports API functions
export const getLiveSports = async (limit = 8) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/sports/live`, {
      params: { limit }
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching live sports:', error);
    return { success: false, error: error.message };
  }
};

export const getUpcomingSports = async (limit = 8) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/sports/upcoming`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming sports:', error);
    return { success: false, error: error.message };
  }
};

export const getSportsByCategory = async (category, limit = 8) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/sports/category/${category}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching sports by category:', error);
    return { success: false, error: error.message };
  }
};

export const getPopularSports = async (limit = 8) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/sports/popular`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular sports:', error);
    return { success: false, error: error.message };
  }
};


// News API functions
export const getBreakingNews = async (limit = 6) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/news/breaking`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching breaking news:', error);
    return { success: false, error: error.message };
  }
};

export const getTrendingNews = async (limit = 6) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/news/trending`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return { success: false, error: error.message };
  }
};

export const getLatestNews = async (limit = 6) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/news/latest`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return { success: false, error: error.message };
  }
};

export const getNewsByCategory = async (category, limit = 6) => {
  try {
    const response = await axios.get(`${url}/mediaprovider/news/category/${category}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news by category:', error);
    return { success: false, error: error.message };
  }
};

// Search API
export const searchMediaApi = async (searchParams) => {
  try {
    const { data } = await axios.get(`${url}/media/search`, {
      params: {
        query: searchParams.query,
        type: searchParams.type,
        genre: searchParams.genre,
        year: searchParams.year,
        language: searchParams.language,
        limit: searchParams.limit || 24,
        page: searchParams.page || 1
      },
      ...jsonconfig
    });

    // Get related media if we have results
    let relatedMedia = [];
    if (data.data && data.data.length > 0) {
      const relatedResponse = await axios.get(`${url}/media/related`, {
        params: {
          mediaId: data.data[0]._id,
          limit: 6
        },
        ...jsonconfig
      });
      relatedMedia = relatedResponse.data.data || [];
    }

    return {
      success: true,
      data: data.data || [],
      related: relatedMedia,
      count: data.count || 0
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      success: false,
      data: [],
      related: [],
      count: 0,
      error: error.response?.data || error.message
    };
  }
};

// Get Related Media API
export const getRelatedMediaApi = async (mediaId) => {
  try {
    const response = await axios.get(`${url}/media/related/${mediaId}`, jsonconfig);
    return response.data;
  } catch (error) {
    console.error('Error fetching related media:', error);
    return { success: false, error: error.message };
  }
};

// User Media Actions APIs
export const addToWatchLater = async (mediaId) => {
  try {
    const response = await axios.post(`${url}/user/watch-later/add`, { mediaId }, jsonconfig);
    return { 
      success: true, 
      data: response.data,
      message: 'Added to Watch Later'
    };
  } catch (error) {
    console.error('Error adding to watch later:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to add to watch later',
      message: error.response?.data?.message || 'Failed to add to watch later'
    };
  }
};

export const removeFromWatchLater = async (mediaId) => {
  try {
    const response = await axios.post(`${url}/user/watch-later/remove`, { mediaId }, jsonconfig);
    return { 
      success: true, 
      data: response.data,
      message: 'Removed from Watch Later'
    };
  } catch (error) {
    console.error('Error removing from watch later:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to remove from watch later',
      message: error.response?.data?.message || 'Failed to remove from watch later'
    };
  }
};

export const getWatchLaterList = async () => {
  try {
    const response = await axios.get(`${url}/user/watch-later`, jsonconfig);
    return { 
      success: true, 
      data: response.data?.data || [] 
    };
  } catch (error) {
    console.error('Error fetching watch later list:', error);
    return { 
      success: false, 
      data: [],
      message: error.response?.data?.message || 'Failed to fetch watch later list'
    };
  }
};

export const addToFavorites = async (mediaId) => {
  try {
    const response = await axios.post(`${url}/user/favorites/add`, { mediaId }, jsonconfig);
    return { 
      success: true, 
      data: response.data,
      message: 'Added to Favorites'
    };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to add to favorites',
      message: error.response?.data?.message || 'Failed to add to favorites'
    };
  }
};

export const removeFromFavorites = async (mediaId) => {
  try {
    const response = await axios.post(`${url}/user/favorites/remove`, { mediaId }, jsonconfig);
    return { 
      success: true, 
      data: response.data,
      message: 'Removed from Favorites'
    };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to remove from favorites',
      message: error.response?.data?.message || 'Failed to remove from favorites'
    };
  }
};

export const getFavoritesList = async () => {
  try {
    const response = await axios.get(`${url}/user/favorites`, jsonconfig);
    return { 
      success: true, 
      data: response.data?.data || [] 
    };
  } catch (error) {
    console.error('Error fetching favorites list:', error);
    return { 
      success: false, 
      data: [],
      message: error.response?.data?.message || 'Failed to fetch favorites list'
    };
  }
};

export const checkMediaInUserLists = async (mediaId) => {
  try {
    const response = await axios.get(`${url}/user/checklists/${mediaId}`, jsonconfig);
    return { 
      success: true, 
      data: response.data?.data || { inWatchLater: false, inFavorites: false } 
    };
  } catch (error) {
    console.error('Error checking media in user lists:', error);
    return { 
      success: false, 
      data: { inWatchLater: false, inFavorites: false },
      message: error.response?.data?.message || 'Failed to check media in user lists'
    };
  }
};
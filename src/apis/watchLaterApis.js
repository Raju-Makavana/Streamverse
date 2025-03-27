import axios from 'axios';
import { getEnvConfig } from '../config/envConfig';

const url = getEnvConfig.get("backendURI");
const jsonconfig = { withCredentials: true };

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

export const checkWatchLaterStatus = async (mediaId) => {
  try {
    const response = await axios.get(`${url}/user/watch-later/check/${mediaId}`, jsonconfig);
    return { 
      success: true, 
      inWatchLater: response.data?.inWatchLater || false
    };
  } catch (error) {
    console.error('Error checking watch later status:', error);
    return { 
      success: false, 
      inWatchLater: false,
      message: error.response?.data?.message || 'Failed to check watch later status'
    };
  }
}; 
import axios from 'axios';
import { getEnvConfig } from '../config/envConfig';

const url = getEnvConfig.get("backendURI");
// const jsonconfig = { withCredentials: true };
const jsonconfig = {
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

export const addLike = async (mediaId) => {
  try {
    const response = await axios.post(`${url}/user/likes/add`, { mediaId }, jsonconfig);
    return { 
      success: true, 
      data: response.data,
      message: 'Added to Likes'
    };
  } catch (error) {
    console.error('Error adding like:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to add like',
      message: error.response?.data?.message || 'Failed to add like'
    };
  }
};

export const removeLike = async (mediaId) => {
  try {
    const response = await axios.post(`${url}/user/likes/remove`, { mediaId }, jsonconfig);
    return { 
      success: true, 
      data: response.data,
      message: 'Removed from Likes'
    };
  } catch (error) {
    console.error('Error removing like:', error);
    return { 
      success: false, 
      error: error.response?.data?.message || 'Failed to remove like',
      message: error.response?.data?.message || 'Failed to remove like'
    };
  }
};

export const getLikedMedia = async () => {
  try {
    const response = await axios.get(`${url}/user/likes`, jsonconfig);
    return { 
      success: true, 
      data: response.data?.data || [] 
    };
  } catch (error) {
    console.error('Error fetching liked media:', error);
    return { 
      success: false, 
      data: [],
      message: error.response?.data?.message || 'Failed to fetch liked media'
    };
  }
};

export const getLikeCount = async (mediaId) => {
  try {
    const response = await axios.get(`${url}/user/likes/count/${mediaId}`, jsonconfig);
    return { 
      success: true, 
      count: response.data?.count || 0
    };
  } catch (error) {
    console.error('Error fetching like count:', error);
    return { 
      success: false, 
      count: 0,
      message: error.response?.data?.message || 'Failed to fetch like count'
    };
  }
};

export const checkLikeStatus = async (mediaId) => {
  try {
    const response = await axios.get(`${url}/user/likes/check/${mediaId}`, jsonconfig);
    return { 
      success: true, 
      isLiked: response.data?.isLiked || false
    };
  } catch (error) {
    console.error('Error checking like status:', error);
    return { 
      success: false, 
      isLiked: false,
      message: error.response?.data?.message || 'Failed to check like status'
    };
  }
}; 
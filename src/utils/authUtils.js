import { getEnvConfig } from '../config/envConfig';
import axios from 'axios';

const url = getEnvConfig.get("backendURI");

/**
 * Helper function to check if a user is authenticated before performing an action
 * @param {Object} options - Configuration options
 * @param {boolean} options.isAuthenticated - Whether the user is authenticated
 * @param {Function} options.onAuthRequired - Callback for when auth is required but user is not authenticated
 * @param {Function} options.onAuthSuccess - Callback to execute when user is authenticated
 */
export const requireAuth = ({ isAuthenticated, onAuthRequired, onAuthSuccess }) => {
  if (!isAuthenticated) {
    if (onAuthRequired) {
      onAuthRequired();
    }
    return false;
  }
  
  if (onAuthSuccess) {
    onAuthSuccess();
  }
  return true;
};

/**
 * Toggle an item in a user collection (favorites, watch later, etc.)
 * @param {Object} options - Configuration options
 * @param {string} options.mediaId - The ID of the media item
 * @param {string} options.collection - The collection type ('favorites' or 'watch-later')
 * @param {boolean} options.isInCollection - Whether the item is already in the collection
 * @param {Function} options.onSuccess - Callback for successful operation
 * @param {Function} options.onError - Callback for failed operation
 */
export const toggleUserCollection = async ({ 
  mediaId, 
  collection, 
  isInCollection, 
  onSuccess, 
  onError 
}) => {
  try {
    const action = isInCollection ? 'remove' : 'add';
    const endpoint = `${url}/user/${collection}/${action}`;
    
    const response = await axios.post(endpoint, { mediaId }, {
      withCredentials: true
    });
    
    if (response.data.success) {
      if (onSuccess) {
        onSuccess(response.data);
      }
      return { success: true, message: response.data.message };
    } else {
      if (onError) {
        onError(response.data);
      }
      return { success: false, message: response.data.message || 'Operation failed' };
    }
  } catch (error) {
    console.error(`Error toggling ${collection}:`, error);
    if (onError) {
      onError({ message: 'An error occurred. Please try again.' });
    }
    return { success: false, message: 'An error occurred. Please try again.' };
  }
};

/**
 * Update watch history for a media item
 * @param {string} mediaId - The ID of the media item
 * @param {number} watchProgress - Current watch position in seconds
 * @param {number} duration - Total duration of the media in seconds
 */
export const updateWatchHistory = async (mediaId, watchProgress, duration) => {
  try {
    await axios.post(`${url}/user/history/update`, 
      { 
        mediaId,
        watchProgress,
        duration
      }, 
      {
        withCredentials: true
      }
    );
    return true;
  } catch (error) {
    console.error('Error updating watch history:', error);
    return false;
  }
};

export default {
  requireAuth,
  toggleUserCollection,
  updateWatchHistory
}; 
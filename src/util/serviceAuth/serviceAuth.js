import axios from 'axios';
import { getEnvConfig } from '../../config/envConfig';

const API_URL = getEnvConfig.get("backendURI");

export const googleLoginApi = async (tokenData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google`, tokenData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };
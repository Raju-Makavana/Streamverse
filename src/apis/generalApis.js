import axios from "axios";
import { getEnvConfig } from "../config/envConfig";
import { loginUser, logoutUser } from "../slices/authSlice";

const url = getEnvConfig.get("backendURI");

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

// register api
export const registerApi = async (userData) => {
  try {
    const { data } = await axios.post(
      `${url}/auth/register`,
      userData,
      jsonconfig
    );
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};

// Login API with Redux integration
export const loginApi = (userData) => async (dispatch) => {
  try {
    const resultAction = await dispatch(loginUser(userData));
    if (loginUser.fulfilled.match(resultAction)) {
      return resultAction.payload;
    } else {
      return { 
        success: false, 
        message: resultAction.payload || "Login failed" 
      };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.response,
      message: error.response?.data?.message || "Login failed"
    };
  }
};

// Logout API
export const logoutApi = () => async (dispatch) => {
  try {
    const resultAction = await dispatch(logoutUser());
    return resultAction.payload;
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false, error: error.response };
  }
};

// Profile API calls
export const updateProfileApi = async (profileData) => {
  try {
    const { data } = await axios.put(
      `${url}/user/update-profile`,
      profileData,
      jsonconfig
    );
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};

export const changePasswordApi = async (passwordData) => {
  try {
    const { data } = await axios.put(
      `${url}/user/change-password`,
      passwordData,
      jsonconfig
    );
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};

export const uploadProfileImageApi = async (imageData) => {
  try {
    const { data } = await axios.post(
      `${url}/user/upload-profile-image`,
      imageData,
      formDataconfig
    );
    return data;
  } catch (error) {
    return { success: false, error: error.response };
  }
};
import axios from "axios";
import { getEnvConfig } from "../config/envConfig";

const url = getEnvConfig.get("backendURI");

// Common axios config
const createAxiosConfig = (contentType = "application/json") => ({
  headers: {
    "Content-Type": contentType,
  },
  withCredentials: true,
});

// Create axios instance with default config
const api = axios.create({
  baseURL: url,
  ...createAxiosConfig(),
});

class AuthAPI {
  static async login(userData) {
    try {
      const { data } = await api.post("/auth/login", userData);
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async googleLogin(tokenData) {
    try {
      const { data } = await api.post("/auth/google", tokenData);
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async logout() {
    try {
      const { data } = await api.get("/auth/logout");
      return data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  static async loadUser() {
    try {
      const { data } = await api.get("/auth/loaduser");
      return data;
    } catch (error) {
      console.log("Load user error:", error.response?.status);
      // Don't treat 401 as an error during loadUser, just return not authenticated
      if (error.response?.status === 401) {
        return {
          success: false,
          message: "User not authenticated"
        };
      }
      return this.handleError(error);
    }
  }

  static handleError(error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred",
      error: error.response
    };
  }
}

export default AuthAPI;
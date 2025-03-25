import { getEnvConfig } from "@/config/envConfig";
import axios from "axios";
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

export const  loginHandler = (loginCred) => async (dispatch) => {
  try {
    dispatch({ type: "LOGIN_REQUEST" });
    const { data } = await axios.post(
      `${url}/auth/login`,
      loginCred,
      jsonconfig
    );

    dispatch({ type: "LOGIN_SUCCESS", payload: data });
    dispatch(loadUser());
    return data;
  } catch (error) {
    dispatch({ type: "LOGIN_FAILURE", payload: "Login Failed" });
    return (
      error.response.data ||
      error.message ||
      "Login Failed Please Try Again After Sometime"
    );
  }
};

export const logoutUser = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${url}/auth/logout`, jsonconfig);
    dispatch({ type: "LOGOUT_USER", payload: data });
    return data;
  } catch (error) {
    dispatch({ type: "LOGOUT_USER", payload: error });
  }
};

export const loadUser = () => async (dispatch) => {
  try { 
    const { data } = await axios.get(`${url}/auth/profile`, jsonconfig);
    dispatch({ type: "LOAD_USER_SUCCESS", payload: data });
  } catch (error) {
    dispatch({ type: "LOAD_USER_FAIL", payload: error });
    console.log("error: ", error);
    return error.response.data;
  }
};

export const fetchCreditDetails = () => async (dispatch) => {
  try {
    const response = await axios.get(`${url}/user/getCreditsData`, jsonconfig);
    dispatch({ type: "UPDATE_CREDIT_DETAILS", payload: response.data.data });
  } catch (error) {
    console.log("error: ", error);
    return error.response.data;
  }
};

export const getNotificationApi = () => async (dispatch) => {
  try {
    const { data } = await axios.get(`${url}/notifications`, jsonconfig);

    dispatch({ type: "UPDATE_NOTIFICATIONS", payload: data });
  } catch (error) {
    // dispatch({ type: "LOAD_USER_FAIL", payload: error });
    console.log("error: ", error);
    return error.response.data;
  }
};
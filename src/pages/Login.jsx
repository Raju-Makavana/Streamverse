import { useEffect, useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import LoginIcon from "@mui/icons-material/Login";
import GoogleIcon from "@mui/icons-material/Google";
import bg from "../assets/Background.png";
import { loginApi } from "../apis/generalApis";
import Swal from "sweetalert2";
import { getEnvConfig } from "../config/envConfig";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleLoginApi } from "../util/serviceAuth/serviceAuth";
import logo from "../assets/StreamVerse.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  clearError,
  googleLoginUser,
} from "../slices/authSlice";

const googleId = getEnvConfig.get("googleClientId");

export default function Login() {
  const { error, isAuthenticated } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // In Login.jsx
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await loginApi(data)(dispatch);

      if (response.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Login Successful",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        navigate("/home");
      } else {
        Swal.fire({
          position: "center",
          icon: "error",
          title: response.message || "Invalid credentials",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Login Failed, Please Try After Sometime",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      const resultAction = await dispatch(
        googleLoginUser({ token: credentialResponse.credential })
      );

      if (googleLoginUser.fulfilled.match(resultAction)) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Google Login Successful",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/home");
      }
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Google Login Failed",
        text: "Please try again later",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Google Login Failed",
      text: "Please try again later",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  return (
    <GoogleOAuthProvider clientId={googleId}>
      <Box
        sx={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        {/* Background Image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            },
          }}
        >
          <img src={bg} alt="Background" />
        </Box>

        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            padding: '20px',
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              maxWidth: '500px',
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              p: 4,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Box sx={{ textAlign: "center", display:"flex", alignItems:"center", flexDirection:"column"}}>
              <img src={logo} alt="Logo" style={{ height: 50, marginBottom:10 }} />

              <Typography variant="h4" component="h1" gutterBottom>
                Welcome Back
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                Please login to your account
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <TextField
                label="Email Address"
                variant="outlined"
                fullWidth
                margin="normal"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                  },
                }}
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{ style: { color: "#fff" } }}
              />

              {/* Password Field */}
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                type={showPassword ? "text" : "password"}
                margin="normal"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
                  },
                })}
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.5)",
                    },
                  },
                }}
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{
                  style: { color: "#fff" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ color: "#fff" }} />
                        ) : (
                          <Visibility sx={{ color: "#fff" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Link
                  to="/forgot-password"
                  style={{ color: "#e50914", textDecoration: "none" }}
                >
                  Forgot Password?
                </Link>
              </Box> */}

              <Box sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    mb: 2,
                    backgroundColor: "#e50914",
                    "&:hover": {
                      backgroundColor: "#f6121d",
                    },
                    py: 1.5,
                  }}
                >
                  Sign In
                </Button>
              </Box>

              <Divider sx={{ my: 3, bgcolor: "rgba(255, 255, 255, 0)" }}>
                OR
              </Divider>

              {/* <Button
              variant="outlined"
              fullWidth
              size="large"
              startIcon={<GoogleIcon />}
              sx={{
                color: "#fff",
                borderColor: "#fff",
                "&:hover": {
                  borderColor: "#e50914",
                  color: "#e50914",
                },
                py: 1.5,
              }}
              onClick={handleGoogleLogin}
            >
              Sign in with Google
            </Button> */}

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginError}
                  theme="filled_black"
                  shape="rectangular"
                  text="signin_with"
                  size="large"
                  sx={{
                    color: "#fff",
                    borderColor: "#fff",
                    "&:hover": {
                      borderColor: "#e50914",
                      color: "#e50914",
                    },
                    py: 1.5,
                  }}
                />
              </Box>

              <Box sx={{ textAlign: "center", mt: 4 }}>
                <Typography variant="body2">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    style={{
                      color: "#e50914",
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </form>
          </Paper>
        </Box>
      </Box>
    </GoogleOAuthProvider>
  );
}

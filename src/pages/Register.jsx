import React, { useState } from 'react';
import { 
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  Alert
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerApi } from '../apis/generalApis';
import  img from '../assets/content-2.jpg';
import Swal from 'sweetalert2';
export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Watch password for confirmation validation
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      const { confirmPassword, ...payloadData } = data;
      
      const response = await registerApi(payloadData);
      
      if (!response.success) {
        Swal.fire({
          position: "center",
          icon: "error",
          title: response.error.data.message || "User Registration Failed",
          showConfirmButton: false,
          timer: 4000,
          timerProgressBar: true,
        });
        return;
      }
      Swal.fire({
        position: "centtrer",
        icon: "success",
        title: "User Registration Successful",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });
      navigate("/login");
    } catch (error) {
      console.log(error);
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Registration Failed. Please try again",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      width: '100%'
    }}>
      {/* Left side - Form */}
      <Box sx={{
        width: '50%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000'
      }}>
        <Box sx={{ 
          width: '100%',
          maxWidth: '450px',
          px: 3
        }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#fff' }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1, color: '#fff' }}>
              Get started with StreamVerse
            </Typography>
          </Box>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              fullWidth
              label="Full Name"
              variant='outlined'
              margin="normal"
              error={!!errors.name}
              helperText={errors.name?.message}
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
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
            />

            <TextField
              fullWidth
              label="Email"
              variant='outlined'
              margin="normal"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
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

            <TextField
              label="Password"
              variant='outlined'
              name="password"
              fullWidth
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                style: { color: "#fff" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff sx={{ color: '#fff' }}/> : <Visibility sx={{ color: '#fff' }}/>}
                    </IconButton>
                  </InputAdornment>
                )
              }}
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
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
                }
              })}
             
              InputLabelProps={{ style: { color: "#fff" } }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              variant='outlined'
              name="confirmPassword"
              margin="normal"
              type={showConfirmPassword ? 'text' : 'password'}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                style: { color: "#fff" },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <VisibilityOff sx={{ color: '#fff' }} /> : <Visibility sx={{ color: '#fff' }} />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value =>
                  value === password || 'Passwords do not match'
              })}
              InputLabelProps={{ style: { color: "#fff" } }}
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
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{ 
                mt: 2,
                mb: 2, 
                backgroundColor: '#e50914', 
                '&:hover': { 
                  backgroundColor: '#f6121d' 
                },
                textTransform: 'uppercase',
                py: 1.5
              }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <Box sx={{ textAlign: 'center', color: '#fff' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#e50914',
                    textDecoration: 'none'
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </form>
        </Box>
      </Box>

      {/* Right side - Image */}
      <Box sx={{
        width: '50%',
        height: '100%',
        backgroundImage: `url(${img})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

      {/* Right Side - Image */}
      {/* <Box
        sx={{
          flex: "0 0 50%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.3)",
            },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 40,
            left: 40,
            right: 40,
            color: "#fff",
            zIndex: 1,
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
            Welcome Back!
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.8 }}>
            Sign in to continue your journey with us
          </Typography>
        </Box>
      </Box> */}
      
    </Box>
  );
}
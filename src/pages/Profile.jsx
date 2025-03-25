import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  TextField,
  IconButton,
  CircularProgress,
  Divider,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfileApi, uploadProfileImageApi } from '../apis/generalApis';
import Swal from 'sweetalert2';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setLoading(true);
      const response = await uploadProfileImageApi(formData);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Profile image updated successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        // Update the user state with new image
        // You'll need to implement this action in your auth slice
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to update profile image',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await updateProfileApi(formData);
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Profile updated successfully!',
          showConfirmButton: false,
          timer: 1500
        });
        setIsEditing(false);
        // Update the user state with new data
        // You'll need to implement this action in your auth slice
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to update profile',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 12, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar
              src={user?.profileImage || "/avatar.png"}
              sx={{ width: 120, height: 120 }}
            />
            <input
              accept="image/*"
              type="file"
              id="icon-button-file"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="icon-button-file">
              <IconButton
                component="span"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': { backgroundColor: 'primary.dark' },
                }}
              >
                <EditIcon />
              </IconButton>
            </label>
          </Box>
          <Box sx={{ ml: 3 }}>
            <Typography variant="h4">{user?.name || 'User'}</Typography>
            <Typography color="textSecondary">{user?.email}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3 }} />

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            {!isEditing ? (
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="outlined"
                  startIcon={<CancelIcon />}
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </>
            )}
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Profile;
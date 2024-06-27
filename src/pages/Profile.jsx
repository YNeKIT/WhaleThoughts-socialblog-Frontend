import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Avatar,
  Typography,
  Box,
  Button,
  Divider,
  Dialog,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  TextField,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAuthMe,
  selectIsAuth,
  selectUserData,
  updateUserDescription,
  uploadAvatar,
} from "../redux/slices/auth";
import { fetchUserPosts } from "../redux/slices/posts";
import GroupIcon from "@mui/icons-material/Group";
import { AddPost } from "./AddPost";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import EditIcon from "@mui/icons-material/Edit";
import styles from './AddPost/AddPost.module.scss';

export const Profile = () => {
  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector(selectUserData);
  const userPosts = useSelector((state) => state.posts.userPosts.items);
  const userPostsStatus = useSelector((state) => state.posts.userPosts.status);
  const [openAddPostModal, setOpenAddPostModal] = useState(false);
  const [openEditDescription, setOpenEditDescription] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [description, setDescription] = useState(userData?.bio || "");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAuthMe());
    dispatch(fetchUserPosts());
  }, [dispatch]);

  const handleOpenAddPostModal = () => {
    setOpenAddPostModal(true);
  };

  const handleCloseAddPostModal = () => {
    setOpenAddPostModal(false);
  };

  const handleOpenEditDescription = () => {
    setOpenEditDescription(true);
  };

  const handleCloseEditDescription = () => {
    setOpenEditDescription(false);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    setAvatarFile(file);
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("image", avatarFile);

    try {
      const result = await dispatch(uploadAvatar(formData));
      if (uploadAvatar.fulfilled.match(result)) {
        console.log("Avatar uploaded successfully:", result.payload);
      } else {
        console.error("Avatar upload failed:", result.error.message);
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
    }
  };

  const handleSaveDescription = async () => {
    try {
      await dispatch(updateUserDescription({ description }));
      console.log("Description updated successfully!");
      handleCloseEditDescription();
    } catch (error) {
      console.error("Error updating description:", error);
    }
  };

  // Ensure userData?.avatarUrl is defined and doesn't start with a slash
  const avatarUrl = userData?.avatarUrl
    ? `${process.env.REACT_APP_API_URL}/${userData.avatarUrl.replace(/^\//, '')}`
    : null;

    console.log(`{${process.env.REACT_APP_API_URL}${userData?.avatarUrl}}`)

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <label className={styles.avatar} htmlFor="avatar-upload">
              <Avatar
                alt={userData?.fullName || "User Name"}
                src={avatarUrl}
                sx={{ width: 120, height: 120 }}
              />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
              <IconButton
                className={styles.photoIcon}
                color="primary"
                aria-label="upload picture"
                component="span"
              >
                <PhotoCameraIcon />
              </IconButton>
            </label>
          </Grid>
          <Grid item>
            <Typography variant="h4">
              {userData?.fullName || "@UserName"}
            </Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <GroupIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="textSecondary" ml={1}>
                {userData?.friends.length || 0} Friends
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mt={1}>
              <Typography variant="body2" color="textSecondary">
                {userData?.postsCount || 0} Posts
              </Typography>
            </Box>
            <Box mt={1}>
              <Typography variant="body1">{userData?.description}</Typography>
              <IconButton
                color="primary"
                aria-label="edit description"
                onClick={handleOpenEditDescription}
              >
                <EditIcon />
              </IconButton>
            </Box>
            <Box mt={3}>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleOpenAddPostModal}
              >
                Add Post
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={handleAvatarUpload}
                disabled={!avatarFile}
                style={{ marginLeft: 10 }}
              >
                Upload Avatar
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box my={4}>
        <Typography variant="h5" gutterBottom>
          Posts
        </Typography>
        <Grid container spacing={4}>
          {userPostsStatus === "loading" ? (
            <Typography>Loading...</Typography>
          ) : userPostsStatus === "error" ? (
            <Typography>Error loading posts</Typography>
          ) : userPosts.length > 0 ? (
            userPosts.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`${process.env.REACT_APP_API_URL}/${post.imageUrl.replace(/^\//, '')}`}
                    alt={post.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {post.tags.join(" #")}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      View Post
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography className={styles.noposts}>No posts available</Typography>
          )}
        </Grid>
      </Box>
      <Dialog open={openAddPostModal} onClose={handleCloseAddPostModal}>
        <AddPost handleCloseModal={handleCloseAddPostModal} />
      </Dialog>
      <Dialog open={openEditDescription} onClose={handleCloseEditDescription}>
        <DialogTitle>Edit Description</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDescription} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveDescription} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

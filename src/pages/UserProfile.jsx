import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Avatar,
  Typography,
  Box,
  Button,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, addFriend } from "../redux/slices/userProfile";
import GroupIcon from "@mui/icons-material/Group";
import styles from './AddPost/AddPost.module.scss';

export const UserProfile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();

  const { data: userProfileData, status, error } = useSelector((state) => state.userProfile);
  const [isFriend, setIsFriend] = useState(false);

  useEffect(() => {
    dispatch(fetchUserProfile(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    if (userProfileData && userProfileData.friends) {
      setIsFriend(userProfileData.friends.some((friend) => friend._id === userId));
    }
  }, [userProfileData, userId]);

  const handleAddFriend = () => {
    dispatch(addFriend(userId)).then(() => {
      // Optionally perform any other actions after adding a friend
    });
  };

  if (status === "loading") {
    return <Typography>Loading...</Typography>;
  }

  if (status === "failed" || !userProfileData) {
    return <Typography>Error: {error}</Typography>;
  }

  const friendsCount = userProfileData.friends ? userProfileData.friends.length : 0;
  const postsCount = userProfileData.posts ? userProfileData.posts.length : 0;

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              alt={userProfileData.fullName}
              src={`${process.env.REACT_APP_API_URL}${userProfileData.avatarUrl}`}
              sx={{ width: 120, height: 120 }}
            />
          </Grid>
          <Grid item>
            <Typography variant="h4">{userProfileData.fullName}</Typography>
            <Box display="flex" alignItems="center" mt={1}>
              <GroupIcon color="primary" fontSize="small" />
              <Typography variant="body2" color="textSecondary" ml={1}>
                {friendsCount} Friends
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mt={1}>
              <Typography variant="body2" color="textSecondary">
                {postsCount} Posts
              </Typography>
            </Box>
            <Box mt={1}>
              <Typography variant="body1">{userProfileData.description}</Typography>
            </Box>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddFriend}
                disabled={isFriend} // Disable button if already friends
              >
                {isFriend ? "Already a Friend" : "Add Friend"}
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
          {userProfileData.posts && userProfileData.posts.length > 0 ? (
            userProfileData.posts.map((post, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`${process.env.REACT_APP_API_URL}${post.imageUrl}`}
                    alt={post.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {post.tags}
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
    </Container>
  );
};

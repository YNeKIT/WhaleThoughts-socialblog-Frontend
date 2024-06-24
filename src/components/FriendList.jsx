import React from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Box, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { selectUserData } from "../redux/slices/auth";
import Lottie from "lottie-react";
import Nofriends from "../Icons/nofriends.json";
import styles from './UserInfo/UserInfo.module.scss';

const StyledBadge = styled(Badge)(({ theme, isOnline }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: isOnline ? '#44b700' : '#ff0000',
    color: isOnline ? '#44b700' : '#ff0000',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

export const FriendList = () => {
  const userData = useSelector(selectUserData); // Fetch user data
  const navigate = useNavigate(); // Use the useNavigate hook

  // Handler to navigate to user's profile
  const handleFriendClick = (friendId) => {
    navigate(`/userProfile/${friendId}`);
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Friends
      </Typography>
      {userData?.friends.length > 0 ? (
        <List>
          {userData.friends.map((friend) => (
            <ListItem 
              key={friend._id} 
              sx={{ padding: '10px 0' }}
              button 
              onClick={() => handleFriendClick(friend._id)} // Add click handler
            >
              <ListItemAvatar>
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  isOnline={friend.isOnline || false} 
                >
                  <Avatar alt={friend.fullName} src={`${process.env.REACT_APP_API_URL}${friend.avatarUrl}`} />
                </StyledBadge>
              </ListItemAvatar>
              <ListItemText
                primary={friend.fullName}
                primaryTypographyProps={{ variant: 'body1', fontWeight: 'medium' }}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1" color="textSecondary">
          <Lottie className={styles.nofriends} animationData={Nofriends} loop={true} />
          You have no friends yet.
        </Typography>
      )}
    </Box>
  );
};

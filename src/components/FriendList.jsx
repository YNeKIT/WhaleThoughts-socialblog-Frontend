import React from 'react';
import { List, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, Box, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';

const friends = [
  { id: 1, name: 'Alice', avatarUrl: 'https://via.placeholder.com/50', isOnline: true },
  { id: 2, name: 'Bob', avatarUrl: 'https://via.placeholder.com/50', isOnline: false },
  { id: 3, name: 'Charlie', avatarUrl: 'https://via.placeholder.com/50', isOnline: true },
];

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
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Friends
      </Typography>
      <List>
        {friends.map((friend) => (
          <ListItem key={friend.id} sx={{ padding: '10px 0' }}>
            <ListItemAvatar>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                isOnline={friend.isOnline}
              >
                <Avatar alt={friend.name} src={friend.avatarUrl} />
              </StyledBadge>
            </ListItemAvatar>
            <ListItemText
              primary={friend.name}
              primaryTypographyProps={{ variant: 'body1', fontWeight: 'medium' }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

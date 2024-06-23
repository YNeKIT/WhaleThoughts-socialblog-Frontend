import React, { useState } from 'react';
import { Container, Grid, List, ListItem, ListItemText, Avatar, Typography, Box, Divider, Paper, TextField, Button } from '@mui/material';

const friends = [
  { id: 1, name: 'Alice', avatarUrl: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Bob', avatarUrl: 'https://via.placeholder.com/50' },
  { id: 3, name: 'Charlie', avatarUrl: 'https://via.placeholder.com/50' },
];

export const Messenger = () => {
  const [selectedFriend, setSelectedFriend] = useState(friends[0]);
  const [messages, setMessages] = useState([
    { text: 'Hi there!', sender: 'Alice', timestamp: '10:00 AM' },
    { text: 'Hello! How are you?', sender: 'Me', timestamp: '10:01 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim()) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([...messages, { text: newMessage, sender: 'Me', timestamp: currentTime }]);
      setNewMessage('');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5">Friends</Typography>
            <List>
              {friends.map((friend) => (
                <ListItem
                  button
                  key={friend.id}
                  selected={selectedFriend.id === friend.id}
                  onClick={() => setSelectedFriend(friend)}
                >
                  <Avatar alt={friend.name} src={friend.avatarUrl} />
                  <ListItemText primary={friend.name} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h5">Chat with {selectedFriend.name}</Typography>
            <Divider />
            <Paper elevation={3} sx={{ height: { xs: '300px', md: '400px' }, padding: '16px', overflowY: 'scroll' }}>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  my={2}
                  p={2}
                  sx={{
                    alignSelf: message.sender === 'Me' ? 'flex-end' : 'flex-start',
                    backgroundColor: message.sender === 'Me' ? '#e0f7fa' : '#f1f1f1',
                    borderRadius: '10px',
                    maxWidth: '60%',
                    wordWrap: 'break-word',
                    marginLeft: message.sender === 'Me' ? 'auto' : '0',
                    marginRight: message.sender === 'Me' ? '0' : 'auto',
                  }}
                >
                  <Typography variant="body1">{message.text}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {message.timestamp}
                  </Typography>
                </Box>
              ))}
            </Paper>
            <Box mt={2} display="flex" alignItems="center" sx={{ flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                label="Type a message"
                variant="outlined"
                fullWidth
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                sx={{ mb: { xs: 1, md: 0 }, flex: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                sx={{ ml: { md: 1 }, width: { xs: '100%', md: 'auto' } }}
                onClick={handleSend}
              >
                Send
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};


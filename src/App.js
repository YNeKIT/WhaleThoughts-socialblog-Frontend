import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from './components';
import { Home, FullPost, Registration, AddPost, Login, Profile, Messenger,  } from './pages';
import {UserProfile} from './pages/UserProfile'
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';

function App() {
const dispatch = useDispatch();
const isAuth  = useSelector(selectIsAuth);

React.useEffect(() => {
  dispatch(fetchAuthMe());
}, []);

  return (
    <Router>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route exact path="/home" element={<Home />} />
          <Route exact path="Profile" element={<Profile />} />
          <Route exact path="Messenger" element={<Messenger />} />
          <Route path="/post/:id" element={<FullPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/" element={<Login />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/userProfile/:userId" element={<UserProfile />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;

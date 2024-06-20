import React, { useEffect, useState } from 'react';
import { Box, Grid, useMediaQuery } from '@mui/material';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import FriendListSection from '../Sections/FriendListSection';
import CreatePostSection from '../Sections/CreatePostSection';
import PostsSection from '../Sections/PostsSection';
import UserWidget from '../Sections/UserSection';

const ProfilePage = () => {
  const [profileUser, setProfileUser] = useState(null);
  const { userId } = useParams();
  const authToken = useSelector((state) => state.token);
  const isDesktop = useMediaQuery('(min-width:1000px)');

  const fetchProfileUser = async () => {
    try {
      const response = await fetch(`http://localhost:3002/users/${userId}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setProfileUser(data);
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  useEffect(() => {
    fetchProfileUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!profileUser) return null;

  return (
    <Box>
      <Navbar />
      <Box width="100%" padding="2rem 6%">
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={3}>
            <UserWidget isProfile="true" userId={userId} picturePath={profileUser.picturePath} />
            <Box mt={2} />
            <FriendListSection userId={userId} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box mt={isDesktop ? 0 : 2}>
              <CreatePostSection picturePath={profileUser.picturePath} />
              <Box mt={2} />
              <PostsSection userId={userId} isProfile />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProfilePage;

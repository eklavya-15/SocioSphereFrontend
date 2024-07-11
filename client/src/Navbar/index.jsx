import React, { useState } from 'react';
import { Box, IconButton, InputBase, Typography, Select, MenuItem, FormControl, useMediaQuery } from '@mui/material';
import { ChatBubble, Menu, Close, NotificationAdd } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../state';
import { useNavigate } from 'react-router-dom';

const CustomNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user);
  const isWideScreen = useMediaQuery('(min-width: 1000px)');
  const bgColor = "#FFFFFF";
  const altColor = "#CAF4FF";
  const highlightColor = "#4793AF";
  
  const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
  const firstName = `${currentUser.firstName}`;
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" padding="1rem 6%" backgroundColor={altColor}>
      <Box display="flex" justifyContent="space-between" alignItems="center" gap="1.75rem">
        <Typography
          fontWeight="bold"
          fontSize="clamp(1rem, 2rem, 2.25rem)"
          color="#005C78"
          onClick={() => navigate('/home')}
          sx={{
            '&:hover': {
              color: 'primaryLight',
              cursor: 'pointer',
            },
          }}
        >
          SocioSphere
        </Typography>
      </Box>

      {/* Desktop Navigation */}
      {isWideScreen ? (
        <Box display="flex" justifyContent="space-between" alignItems="center" gap="2rem">
          <IconButton onClick={() => navigate('/chat')}>
            <ChatBubble sx={{ fontSize: '25px' }} />
          </IconButton>
          <NotificationAdd sx={{ fontSize: '25px' }} />
          <FormControl variant="standard" value={fullName}>
            <Select
              value={fullName}
              sx={{
                backgroundColor: highlightColor,
                width: '150px',
                borderRadius: '0.25rem',
                p: '0.25rem 1rem',
                '& .MuiSvgIcon-root': {
                  pr: '0.25rem',
                  width: '3rem',
                },
                '& .MuiSelect-select:focus': {
                  backgroundColor: highlightColor,
                },
              }}
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <Typography>{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={() => navigate(`/profile/${currentUser._id}`)}>
                  <Typography>View Profile</Typography>
                </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </Box>
      ) : (
        <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <Menu />
        </IconButton>
      )}

      {/* Mobile Navigation */}
      {!isWideScreen && mobileMenuOpen && (
        <Box
          position="fixed"
          right="0"
          bottom="0"
          height="100%"
          zIndex="10"
          maxWidth="500px"
          minWidth="300px"
          backgroundColor={bgColor}
        >
          {/* Close Icon */}
          <Box display="flex" justifyContent="flex-end" p="1rem">
            <IconButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Close />
            </IconButton>
          </Box>

          {/* Menu Items */}
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap="3rem">
            <IconButton onClick={() => navigate('/chat')}>
              <ChatBubble sx={{ fontSize: '25px' }} />
            </IconButton>
            <NotificationAdd sx={{ fontSize: '25px' }} />
            <FormControl variant="standard" value={firstName}>
              <Select
               value={firstName}
                sx={{
                  backgroundColor: highlightColor,
                  width: '150px',
                  borderRadius: '0.5rem',
                  p: '0.25rem 1rem',
                  '& .MuiSvgIcon-root': {
                    pr: '0.25rem',
                    width: '3rem',
                  },
                  '& .MuiSelect-select:focus': {
                    backgroundColor: highlightColor,
                  },
                }}
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <Typography>{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={() => navigate(`/profile/${currentUser._id}`)}>
                  <Typography>View Profile</Typography>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>
                  Log Out
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CustomNavbar;

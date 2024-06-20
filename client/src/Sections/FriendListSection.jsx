import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFriends } from 'state';
import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material';
import { Box, IconButton, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const FriendListSection = ({ userId }) => {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.token);
  const userFriends = useSelector((state) => state.user.friends);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(`http://localhost:3002/users/${userId}/friends`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        dispatch(setFriends({ friends: data }));
      } catch (error) {
        console.log('Error fetching friends:', error.message);
      }
    };

    fetchUserFriends();
  }, [authToken, dispatch, userId]);

  return (
    <Box sx={{ padding: '1.5rem 1.5rem 0.75rem 1.5rem', backgroundColor: '#CAF4FF', borderRadius: '0.75rem' }}>
      <Typography color="#333333" variant="h5" fontWeight="500" sx={{ mb: '1.5rem' }}>
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {userFriends?.map((friend) => (
          <FriendCard
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.bio}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </Box>
  );
};

const FriendCard = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const primaryLight ="#E6FBFF";
  const primaryDark =  "#006B7D";
  const main = "#666666";
  const medium = "#A3A3A3";
  const isFriend = Array.isArray(friends) && friends.some((friend) => friend._id === friendId);

  const patchFriend = async () => {
    try {
      const response = await fetch(`http://localhost:3002/users/${_id}/${friendId}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error('Error updating friend status:', error);
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" alignItems="center" gap="1rem">
        <Box>
          <img
            style={{ objectFit: 'cover', borderRadius: '50%' }}
            width="55px"
            height="55px"
            alt="user"
            src={`https://s3.ap-south-1.amazonaws.com/myawsbucket.lalwani/${userPicturePath}`}
          />
        </Box>
        <Box onClick={() => { navigate(`/profile/${friendId}`); navigate(0); }}>
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              '&:hover': {
                color: "#E6FBFF",
                cursor: 'pointer',
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <IconButton onClick={patchFriend} sx={{ backgroundColor: primaryLight, p: '0.6rem' }}>
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </Box>
  );
};

export default FriendListSection;

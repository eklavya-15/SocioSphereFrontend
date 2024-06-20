import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, setUsers } from "state";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const SuggestionsWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.token);
  const friendsList = useSelector((state) => state.user.friends);
  const usersList = useSelector((state) => state.users);
  const loggedInUser = useSelector((state) => state.user);

  const fetchFriends = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/users/${userId}/friends`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setFriends({ friends: data }));
    } catch (error) {
      console.error("Error fetching friends:", error.message);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3002/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
    });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setUsers({ users: data }));
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchUsers();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const suggestedFriends = Array.isArray(usersList)
    ? usersList.reduce((unique, user) => {
        const isUniqueFriend = !unique.some((f) => f._id === user._id);
        const isNotExistingFriend = loggedInUser.friends.every((f) => f._id !== user._id);
        if (isUniqueFriend && isNotExistingFriend) {
          if (user._id !== loggedInUser._id) {
            unique.push(user);
          }
        }
        return unique;
      }, [])
    : [];

  return (
    <Box
      sx={{
        padding: "1.5rem 1.5rem 0.75rem 1.5rem",
        backgroundColor: "#CAF4FF",
        borderRadius: "0.75rem",
      }}
    >
      <Typography
        color="#333333"
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Suggestions
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {suggestedFriends.map((friend) => (
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

  const primaryLight = "#E6FBFF";
  const primaryDark = "#006B7D";
  const mainColor = "#666666";
  const mediumColor = "#A3A3A3";
  const isFriend =
    Array.isArray(friends) && friends.some((friend) => friend._id === friendId);

  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3002/users/${_id}/${friendId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" justifyContent="space-between" alignItems="center" gap="1rem">
        <Box>
          <img
            style={{ objectFit: "cover", borderRadius: "50%" }}
            width="55px"
            height="55px"
            alt="user"
            src={`https://s3.ap-south-1.amazonaws.com/myawsbucket.lalwani/${userPicturePath}`}
          />
        </Box>
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={mainColor}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: primaryLight,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={mediumColor} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </Box>
      <IconButton
        onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </Box>
  );
};

export default SuggestionsWidget;

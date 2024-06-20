import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Badge,
  InputBase,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import { io } from "socket.io-client";
import axios from "axios";

const ChatPage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const socket = io("http://localhost:3002", {
    query: { token },
  });
  // const socket = require('socket.io-client')('http://localhost:3002', {
  //   transports: ['websocket'],
  //   rejectUnauthorized:   false,
  //  })
  socket.on("connect_error", (err) => {
    // the reason of the error, for example "xhr poll error"
    console.log(err.message);

    // some additional description, for example the status code of the initial HTTP response
    console.log(err.description);

    // some additional context, for example the XMLHttpRequest object
    console.log(err.context);
  });

  const userId = user._id;

  // Fetch friends and unseen messages
  const getFriendsAndUnseenMessages = async () => {
    try {
      const response = await fetch(
        `http://localhost:3002/users/${userId}/friends`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      dispatch(setFriends({ friends: data }));

      // Fetch unseen messages count for each friend
      const unseenResponse = await axios.get(
        `http://localhost:3002/messages/${userId}/unseen`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const unseenData = unseenResponse.data;

      const unseenCount = unseenData.reduce((acc, item) => {
        acc[item.friendId] = item.count;
        return acc;
      }, {});

      setUnseenMessages(unseenCount);
    } catch (error) {
      console.error(
        "Error fetching friends or unseen messages:",
        error.message
      );
    }
  };

  const fetchMessages = async (friendId) => {
    try {
      const response = await fetch(
        `http://localhost:3002/messages/${userId}/${friendId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error.message);
    }
  };

  useEffect(() => {
    getFriendsAndUnseenMessages();

    // Socket.IO event listeners
    socket.on("connect", () => {
      console.log("Connected to the server via Socket.IO");
    });

    socket.on("receive_message", (newMessage) => {
      if (selectedFriend && newMessage.senderId === selectedFriend._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else {
        setUnseenMessages((prev) => ({
          ...prev,
          [newMessage.senderId]: (prev[newMessage.senderId] || 0) + 1,
        }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (selectedFriend) {
      fetchMessages(selectedFriend._id);
    }
  }, [selectedFriend]); // Fetch messages when a new friend is selected

  const handleFriendClick = async (friend) => {
    setSelectedFriend(friend);
    setUnseenMessages((prev) => ({ ...prev, [friend._id]: 0 }));

    // Update unseen message count in backend
    await axios.patch(
      `http://localhost:3002/messages/seen/${userId}/${friend._id}/mark-seen`,
      { count: 0 },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("Selected friend is " + friend._id);
    console.log("User is " + userId);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const newMessage = {
      senderId: userId,
      recipientId: selectedFriend._id,
      content: message,
      timestamp: new Date(),
    };

    // Emit the message to the server
    socket.emit("send_message", newMessage);

    // Update local state
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage("");
  };

  return (
    <Grid container height="100vh">
      <Grid item xs={3} overflow="auto" borderRight={2} bgcolor="#CAF4FF">
        <Box alignItems="center" justifyContent="center">
          <Box paddingY={3} bgcolor="#CAF4FF" borderBottom={2}>
            <Typography variant="h3" fontWeight="500" textAlign="center">
              Chat with Friends
            </Typography>
          </Box>
          {Array.isArray(friends) &&
            friends.map((friend) => (
              <Box
                key={friend._id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={2}
                bgcolor="#CAF4FF"
                borderRadius="8px"
                sx={{ cursor: "pointer" }}
                onClick={() => handleFriendClick(friend)}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Box>
                    <img
                      style={{ objectFit: "cover", borderRadius: "50%" }}
                      width="55px"
                      height="55px"
                      alt="user"
                      src={`https://s3.ap-south-1.amazonaws.com/myawsbucket.lalwani/${friend.picturePath}`}
                    />
                  </Box>
                  <Box>
                    <Typography variant="h4">
                      {friend.firstName} {friend.lastName}
                    </Typography>
                    <Typography variant="h5" color="textSecondary">
                      {friend.bio}
                    </Typography>
                  </Box>
                </Box>
                {unseenMessages[friend._id] > 0 && (
                  <Badge
                    badgeContent={unseenMessages[friend._id]}
                    color="primary"
                  />
                )}
              </Box>
            ))}
        </Box>
      </Grid>

      <Grid
        item
        xs={9}
        bgcolor="#fff"
        display="flex"
        flexDirection="column"
        justifyContent="center"
      >
        {selectedFriend ? (
          <Box display="flex" flexDirection="column" height="100%">
            <Box bgcolor="#CAF4FF" pt={3} borderBottom={2}>
              <Typography
                variant="h3"
                fontWeight="500"
                mb={3}
                textAlign="center"
              >
                Chat with {selectedFriend.firstName} {selectedFriend.lastName}
              </Typography>
            </Box>
            {/* Chat content */}
            <Box
              flexGrow={1}
              borderRadius="8px"
              p={2}
              overflow="auto"
              mb={2}
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  display="flex"
                  flexDirection={
                    msg.senderId === userId ? "row-reverse" : "row"
                  }
                  mb={1}
                >
                  <Box
                    bgcolor={msg.senderId === userId ? "#219C90" : "#F6DCAC"}
                    color={
                       "#333333"
                       
                    }
                    borderRadius="8px"
                    p={2}
                    maxWidth="70%"
                  >
                    <Typography variant="h3">{msg.content} </Typography>
                    <Typography variant="h6" color="textSecondary">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            {/* Message input and send button */}
            <Box
              display="flex"
              alignItems="center"
              gap="1rem"
              paddingX={3}
              paddingY={2}
            >
              <InputBase
                placeholder="Send message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                sx={{
                  flexGrow: 1,
                  height: "2.5rem",
                  backgroundColor: "#CDE8E5",
                  borderRadius: "1rem",
                  padding: "1rem 2rem",
                }}
              />
              <Button
                onClick={sendMessage}
                sx={{
                  color: "#CAF4FF",
                  backgroundColor: "#219C90",
                  borderRadius: "3rem",
                  padding: "0.75rem 2rem",
                }}
              >
                Send
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="h6" color="textSecondary" align="center" mt={10}>
            Select a friend to start chatting...
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default ChatPage;

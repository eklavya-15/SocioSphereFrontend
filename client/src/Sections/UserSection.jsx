import {
  Box,
  Typography,
  Divider,
  InputBase,
  Button,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const UserWidget = ({ isProfile, userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const [edit1, setEdit1] = useState(false);
  const [edit2, setEdit2] = useState(false);
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const dark ="#333333";
  const main = "#666666";
  const [bi, setBio] = useState("");
  const [firsName, setfirsName] = useState("");
  const [lasName, setLasName] = useState("");
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost:3002/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
    setUser(data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  };

  const handleBio = async() =>{
    fetch(`http://localhost:3002/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bi}),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        dispatch(setUser(data));
      })
      .catch((error) => {
        console.error("Error updating user data:", error.message);
      });

    setEdit2(false);
    setBio("");
  }

  const handleName =  async () => {
    try {
      const response = await fetch(`http://localhost:3002/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firsName, lasName }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      setUser(data);
    } catch (error) {
      console.error("Error updating user data:", error.message);
    }
    setEdit1(false);
    setfirsName("");
    setLasName("");
    
  }

  useEffect(() => {
    fetchUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  const { firstName, lastName, bio, friends } = user;

  return (
    <Box
      sx={{
        padding: "1.5rem 1.5rem 0.75rem 1.5rem",
        backgroundColor: "#CAF4FF",
        borderRadius: "0.75rem",
      }}
    >
      {/* FIRST ROW */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap="0.5rem"
        pb="1.1rem"
        onClick={() => navigate(`/profile/${userId}`)}
      >
        <Box>
          <img
            style={{ objectFit: "cover", borderRadius: "50%" }}
            width="100px"
            height="100px"
            alt="user"
            src={`https://s3.ap-south-1.amazonaws.com/myawsbucket.lalwani/${picturePath}`}
          />
        </Box>
        <Box display="flex" flexDirection="row" gap="3px">
          {!edit1 && (
            <>
              <Typography
                variant="h4"
                color={dark}
                fontWeight="500"
                sx={{
                  "&:hover": {
                    color: "#E6FBFF",
                    cursor: "pointer",
                  },
                }}
              >
                {firstName} {lastName}
              </Typography>
              {isProfile && <Box
                display="flex"
                flexDirection="column"
                sx={{ cursor: "pointer" }}
                justifyContent="space-between"
                alignItems="center"
                gap="0.25rem"
                onClick={() => {
                  setEdit1(true);
                }}
              >
                <Edit />
              </Box>}
            </>
          )}

          {edit1 && (
            <Box>
              <InputBase
                placeholder="Change Name"
                onChange={(e) => setfirsName(e.target.value)}
                value={firsName}
                sx={{
                  width: "100%",
                  backgroundColor: "#fff",
                  padding: "2px 3px",
                  marginBottom: "5px",
                }}
              />
              <InputBase
                placeholder="Change Last Name"
                onChange={(e) => setLasName(e.target.value)}
                value={lasName}
                sx={{
                  width: "100%",
                  backgroundColor: "#fff",
                  padding: "2px 3px",
                }}
              />
              <Button sx={{ textAlign: "center" }} onClick={handleName}>
                Save
              </Button>
            </Box>
          )}
        </Box>
        <Box display="flex" flexDirection="row" gap="3px">
          {!edit2 && (
            <>
              <Typography variant="h5" color={main} fontWeight="400">
                {bio}
              </Typography>
              {isProfile && <Box
                display="flex"
                sx={{ cursor: "pointer" }}
                justifyContent="space-between"
                alignItems="center"
                gap="0.25rem"
                onClick={() => {
                  setEdit2(true);
                }}
              >
                <Edit />
              </Box>}
            </>
          )}

          {edit2 && (
            <Box>
              <InputBase
                placeholder="New Bio"
                onChange={(e) => setBio(e.target.value)}
                value={bi}
                sx={{
                  width: "100%",
                  backgroundColor: "#fff",
                }}
              />
              <Button onClick={handleBio}>Save</Button>
            </Box>
          )}
        </Box>
      </Box>

      <Divider />

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="1rem"
          mb="0.5rem"
        >
          <Typography variant="h5" fontWeight="400" color={dark}>
            Following:
          </Typography>
          <Typography variant="h5" fontWeight="450" color={dark}>
            {friends.length}
          </Typography>
        </Box>
        <Divider />
        <Box
          pt="1rem"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          gap="1rem"
          mb="0.5rem"
        >
          <Typography variant="h5" fontWeight="400" color={dark}>
            Followers:
          </Typography>
          <Typography variant="h5" fontWeight="450" color={dark}>
            {friends.length}
          </Typography>
        </Box>
        <Divider />
        {!isProfile && <Box
          p="1.5rem 0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          sx={{ cursor: "pointer" }}
          gap="1rem"
          mb="0.5rem"
          onClick={() => navigate(`/profile/${userId}`)}
        >
          <Typography variant="h5" fontWeight="400" color="red">
            View Profile
          </Typography>
        </Box>}
      </Box>
    </Box>
  );
};

export default UserWidget;

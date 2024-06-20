import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
  SendSharp,
  PersonAddOutlined, 
  PersonRemoveOutlined
} from "@mui/icons-material";
import { Box, IconButton, Typography,  InputBase, Button } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setFriends } from "state";
import { useNavigate } from "react-router-dom";
  import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
  } from "react-share";
  import { FacebookIcon, TwitterIcon, WhatsappIcon } from "react-share";
  import { Popover } from "@mui/material";

const PostSection = ({
  postId,
  postUserId,
  name,
  description,
  picturePath,
  videoPath,
  userPicturePath,
  likes,
  comments,
  createdAt,
}) => {
  const fileExtension = picturePath.split('.').pop();
  const videoExtensions = ["mp4", "mkv", "avi"];
  const imageExtensions = ["jpg", "jpeg", "png"];
  const fileType = videoExtensions.includes(fileExtension) ? "video" : imageExtensions.includes(fileExtension) ? "image" : null;

  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isPostLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const mainColor = "#666666"
  const primaryColor = "#00D5FA"
  const shareUrl = window.location.href; // URL to share, customize as needed
    const title = description; // Text to share, customize as needed

    const handleShareClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

  const timeAgo = (postDate) => {
    if (!postDate) return `${Math.floor(Math.random() * 10 + 1)} day ago`;

    const now = new Date();
    const postTime = new Date(postDate);
    const diffInSeconds = Math.floor((now - postTime) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 365) return `${diffInDays} days ago`;
    return postTime.toDateString();
  };

  const handleLike = async () => {
    const response = await fetch(`http://localhost:3002/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const handleComment = async () => {
    const response = await fetch(`http://localhost:3002/posts/${postId}/comments`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description: commentText }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    setIsCommentsVisible(true);
    setCommentText("");
  };

  const postAge = timeAgo(createdAt);

  return (
  
     <Box sx={{ padding: "1.5rem 1.5rem 0.75rem 1.5rem", backgroundColor: "#CAF4FF", borderRadius: "0.75rem", }} m="2rem 0">
    <FriendCard
    friendId={postUserId}
    name={name}
    subtitle={postAge}
    userPicturePath={userPicturePath}
   />

      <Typography color={mainColor} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {fileType === "video" && (
        <video
          controls
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`https://s3.ap-south-1.amazonaws.com/myawsbucket.lalwani/${videoPath}`}
        ></video>
      )}
      {fileType === "image" && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`https://s3.ap-south-1.amazonaws.com/myawsbucket.lalwani/${picturePath}`}
        />
      )}
      <Box display="flex" justifyContent="space-between" alignItems="center" mt="0.25rem">
        <Box display="flex" justifyContent="space-between" alignItems="center" gap="1rem">
          <Box display="flex" justifyContent="space-between" alignItems="center" gap="0.3rem">
            <IconButton onClick={handleLike}>
              {isPostLiked ? (
                <FavoriteOutlined sx={{ color: primaryColor }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center" gap="0.3rem">
            <IconButton onClick={() => setIsCommentsVisible(!isCommentsVisible)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </Box>
        </Box>

        <IconButton onClick={handleShareClick}>
          <ShareOutlined />
        </IconButton>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Box p="1rem" display="flex" flexDirection="column" gap="1rem">
              <FacebookShareButton url={shareUrl} quote={title}>
                <FacebookIcon size={32} round={true} />
              </FacebookShareButton>
              <TwitterShareButton url={shareUrl} title={title}>
                <TwitterIcon size={32} round={true} />
              </TwitterShareButton>
              <WhatsappShareButton url={shareUrl} title={title}>
                <WhatsappIcon size={32} round={true} />
              </WhatsappShareButton>
            </Box>
          </Popover>
        </Box>

        
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <InputBase
          placeholder="Comment here..."
          onChange={(e) => setCommentText(e.target.value)}
          value={commentText}
          sx={{
            width: "75%",
            height: "2.5rem",
            backgroundColor: "#68D2E8",
            borderRadius: "1rem",
            marginTop: "0.75rem",
            padding: "1rem 2rem",
          }}
        />
        <Button
          onClick={handleComment}
          sx={{
            color: "#CAF4FF",
            backgroundColor: "#00D5FA",
            marginTop: "0.75rem",
            borderRadius: "3rem",
          }}
        >
          <SendSharp />
        </Button>
      </Box>
      {isCommentsVisible && (
        <Box mt="0.5rem">
          {comments.map((comment, index) => (
            <Box key={`${name}-${index}`}>
              <Typography sx={{ color: mainColor, m: "0.5rem 0", pl: "1rem" }}>
                {comment}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
     </Box >
   
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
    <Box display="flex" justifyContent="space-between" alignItems="center" >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        gap="1rem"
      >
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
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: "#E6FBFF",
                cursor: "pointer",
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


export default PostSection;

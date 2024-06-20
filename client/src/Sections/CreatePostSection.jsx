import {
  EditOutlined,
  DeleteOutlined,
  ImageOutlined,
  GifBoxOutlined,
  MicOutlined,
  VideoCameraBackOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import Dropzone from "react-dropzone";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const CreatePostSection = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImageUpload, setIsImageUpload] = useState(false);
  const [isVideoUpload, setIsVideoUpload] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [postContent, setPostContent] = useState("");
  const userId = useSelector((state) => state.user._id);
  const authToken = useSelector((state) => state.token);
  const isDesktop = useMediaQuery("(min-width: 1000px)");
  const mediumMainColor = "#686D76";
  const mediumColor = "#A3A3A3";

  const handlePostSubmit = async () => {
    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("description", postContent);
    if (selectedImage) {
      formData.append("picture", selectedImage);
      formData.append("picturePath", selectedImage.name);
    }
    if (selectedVideo) {
      formData.append("picture", selectedVideo);
      formData.append("picturePath", selectedVideo.name);
    }
    const response = await fetch(`http://localhost:3002/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${authToken}` },
      body: formData,
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    setSelectedImage(null);
    setSelectedVideo(null);
    setPostContent("");
    setIsVideoUpload(false);
    setIsImageUpload(false);
  };

  return (
    <Box
      sx={{
        padding: "1.5rem 1.5rem 0.75rem 1.5rem",
        backgroundColor: "#CAF4FF",
        borderRadius: "0.75rem",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" gap="1.5rem">
        <InputBase
          placeholder="Have something to share..."
          onChange={(e) => setPostContent(e.target.value)}
          value={postContent}
          sx={{
            width: "100%",
            backgroundColor: "#4793AF",
            borderRadius: "1rem",
            padding: "1rem 2rem",
            color:"white"
          }}
        />
      </Box>

      {isImageUpload && (
        <Box border={`1px solid ${mediumColor}`} borderRadius="5px" mt="1rem" p="1rem">
          <Dropzone
            accept=".jpg,.jpeg,.png"
            multiple={false}
            onDrop={(acceptedFiles) => setSelectedImage(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box
                  {...getRootProps()}
                  border="2px dashed #00D5FA"
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!selectedImage ? (
                    <Typography>Add Image Here</Typography>
                  ) : (
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography>{selectedImage.name}</Typography>
                      <EditOutlined />
                    </Box>
                  )}
                </Box>
                {selectedImage && (
                  <IconButton onClick={() => setSelectedImage(null)} sx={{ width: "15%" }}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </Box>
            )}
          </Dropzone>
        </Box>
      )}

      {isVideoUpload && (
        <Box border={`1px solid ${mediumColor}`} borderRadius="5px" mt="1rem" p="1rem">
          <Dropzone
            accept=".mp4,.mkv,.avi"
            multiple={false}
            onDrop={(acceptedFiles) => setSelectedVideo(acceptedFiles[0])}
          >
            {({ getRootProps, getInputProps }) => (
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box
                  {...getRootProps()}
                  border="2px dashed #00D5FA"
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!selectedVideo ? (
                    <Typography>Add Video Here</Typography>
                  ) : (
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography>{selectedVideo.name}</Typography>
                      <EditOutlined />
                    </Box>
                  )}
                </Box>
                {selectedVideo && (
                  <IconButton onClick={() => setSelectedVideo(null)} sx={{ width: "15%" }}>
                    <DeleteOutlined />
                  </IconButton>
                )}
              </Box>
            )}
          </Dropzone>
        </Box>
      )}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap="0.25rem"
          onClick={() => {
            setIsVideoUpload(false);
            setIsImageUpload(!isImageUpload);
          }}
        >
          <ImageOutlined sx={{ color: mediumMainColor }} />
          <Typography
            color={mediumMainColor}
            sx={{ "&:hover": { cursor: "pointer", color: mediumColor } }}
          >
            Image
          </Typography>
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap="0.25rem"
          onClick={() => {
            setIsImageUpload(false);
            setIsVideoUpload(!isVideoUpload);
          }}
        >
          <VideoCameraBackOutlined sx={{ color: mediumMainColor }} />
          <Typography
            color={mediumMainColor}
            sx={{ "&:hover": { cursor: "pointer", color: mediumColor } }}
          >
            Video
          </Typography>
        </Box>

        {isDesktop && (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" gap="0.25rem">
              <GifBoxOutlined sx={{ color: mediumMainColor }} />
              <Typography color={mediumMainColor}>GIF</Typography>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" gap="0.25rem">
              <MicOutlined sx={{ color: mediumMainColor }} />
              <Typography color={mediumMainColor}>Audio</Typography>
            </Box>
          </>
        )}

        <Button
          disabled={!postContent}
          onClick={handlePostSubmit}
          sx={{
            color: "#CAF4FF",
            backgroundColor: "#4793AF",
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePostSection;

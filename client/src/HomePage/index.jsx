import { Box, Grid, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "../Navbar";
import UserWidget from "../Sections/UserSection";
import CreatePostSection from "../Sections/CreatePostSection";
import PostsSection from "../Sections/PostsSection";
import SuggestionsWidget from "../Sections/SuggestionsSection";
import FriendListSection from "../Sections/FriendListSection";

const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath } = useSelector((state) => state.user);
  const userId = _id;

  return (
    <Box>
      <Navbar />
      <Box width="100%" padding="2rem 6%">
        <Grid container spacing={isNonMobileScreens ? 3 : 0}>
          <Grid item xs={12} md={isNonMobileScreens ? 3 : undefined}>
            <Box mb={isNonMobileScreens ? 3 : 2}>
              <UserWidget userId={userId} picturePath={picturePath} />
            </Box>
            {isNonMobileScreens && <SuggestionsWidget userId={userId} />}
          </Grid>

          <Grid item xs={12} md={isNonMobileScreens ? 6 : undefined} mt={isNonMobileScreens ? 0 : 2}>
            <CreatePostSection picturePath={picturePath} />
            <PostsSection userId={userId} />
          </Grid>

          {isNonMobileScreens && (
            <Grid item md={3}>
              <FriendListSection userId={userId} />
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;

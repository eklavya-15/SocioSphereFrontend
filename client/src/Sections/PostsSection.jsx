import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostSection from "./PostSection";

const PostsSection = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const authToken = useSelector((state) => state.token);

  const fetchAllPosts = async () => {
    const response = await fetch("http://localhost:3002/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const fetchUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3002/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      fetchUserPosts();
    } else {
      fetchAllPosts();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts && Array.isArray(posts) && posts.map((post) => (
        <PostSection
          key={post._id}
          postId={post._id}
          postUserId={post.userId}
          name={`${post.firstName} ${post.lastName}`}
          description={post.description}
          picturePath={post.picturePath}
          videoPath={post.videoPath}
          userPicturePath={post.userPicturePath}
          likes={post.likes}
          comments={post.comments}
          createdAt={post.createdAt}
        />
      ))}
    </>
  );
};

export default PostsSection;

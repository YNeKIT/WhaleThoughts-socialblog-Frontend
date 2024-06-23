import React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { FriendList } from "../components/FriendList";
import { useDispatch, useSelector } from "react-redux";
import axios from "../axios";
import { fetchPosts, fetchTags } from "../redux/slices/posts";

export const Home = () => {
  const dispatch = useDispatch();
  const { posts, tags } = useSelector((state) => state.posts);
  const isPostsLoading = posts.status === "loading";

  React.useEffect(() => {
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={0}
        aria-label="basic tabs example"
      >
        <Tab label="New" />
        <Tab label="Popular" />
      </Tabs>
      <Box display="flex" justifyContent="center">
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <FriendList />
          </Grid>
          <Grid item xs={12} md={6}>
            {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
              isPostsLoading ? (
                <Post key={index} isLoading={true} />
              ) : (
                <Post
                likes={obj.likes}
                  key={index}
                  id={obj._id}
                  title={obj.title}
                  imageUrl={`http://localhost:4444${obj.imageUrl}`}
                  user={obj.user}
                  createdAt={obj.createdAt}
                  viewsCount={obj.viewsCount}
                  tags={obj.tags}
                  comments={obj.comments}
                  isEditable
                />
              )
            )}
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const { data } = await axios.get("/posts");
  return data;
});

export const fetchOne = createAsyncThunk ("posts/fetchPost", async ({postId}) => {
  const  {data} = await axios.get(`/posts/${postId}`);
  return data;
});


export const fetchTags = createAsyncThunk("posts/fetchTags", async () => {
  const { data } = await axios.get("/tags");
  return data;
});

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async () => {
    const { data } = await axios.get("/posts/user");
    return data;
  }
);

// Add new post thunk
export const createPost = createAsyncThunk("posts/createPost", async (post) => {
  const { data } = await axios.post("/posts", post);
  return data;
});



export const addCommentToPost = createAsyncThunk(
  'posts/addCommentToPost',
  async ({ postId, commentText, token }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/post/${postId}/comments`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { postId, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const toggleLikePost = createAsyncThunk(
  "posts/toggleLike",
  async ({ postId }, { getState }) => {
    try {
      const { auth } = getState();

      const response = await axios.post(
        `/post/${postId}/likes`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`, 
          },
        }
      );
      return response.data; 
    } catch (error) {
      throw error; 
    }
  }
);

const initialState = {
  posts: {
    items: [],
    status: "loading",
  },
  userPosts: {
    items: [],
    status: "loading",
  },
  tags: {
    items: [],
    status: "loading",
  },
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All Posts
      .addCase(fetchPosts.pending, (state) => {
        state.posts.items = [];
        state.posts.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.items = action.payload;
        state.posts.status = "loaded";
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.posts.items = [];
        state.posts.status = "error";
      })
      .addCase(fetchOne.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOne.fulfilled, (state, action) => {
        state.loading = false;
        state.post = action.payload;
      })
      .addCase(fetchOne.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTags.pending, (state) => {
        state.tags.items = [];
        state.tags.status = "loading";
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.tags.items = action.payload;
        state.tags.status = "loaded";
      })
      .addCase(fetchTags.rejected, (state) => {
        state.tags.items = [];
        state.tags.status = "error";
      })
      // Fetch User Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.userPosts.items = [];
        state.userPosts.status = "loading";
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.userPosts.items = action.payload;
        state.userPosts.status = "loaded";
      })
      .addCase(fetchUserPosts.rejected, (state) => {
        state.userPosts.items = [];
        state.userPosts.status = "error";
      })
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.userPosts.status = "loading";
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.userPosts.items.push(action.payload);
        state.userPosts.status = "loaded";
      })
      .addCase(createPost.rejected, (state) => {
        state.userPosts.status = "error";
      })
      .addCase(addCommentToPost.fulfilled, (state, action) => {
        const { postId, comment } = action.payload;
        const postIndex = state.posts.items.findIndex(post => post._id === postId);
        if (postIndex !== -1) {
          state.posts.items[postIndex].comments.push(comment);
        }
      })
      .addCase(addCommentToPost.rejected, (state, action) => {
        console.error('Failed to add comment:', action.payload);
      })
      .addCase(toggleLikePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

      
        const updatedPost = action.payload; 
        const updatedPosts = state.posts.items.map((post) =>
          post._id === updatedPost._id ? updatedPost : post
        );
        state.posts.items = updatedPosts   || "succes update post" ;
      })
      .addCase(toggleLikePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to toggle like";
      });
  },
});

export const postsReducer = postSlice.reducer;

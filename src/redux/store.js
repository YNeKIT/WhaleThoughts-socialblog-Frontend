import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";
import { userProfileReducer } from "./slices/userProfile";

const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    userProfile: userProfileReducer,
  },
});

export default store;

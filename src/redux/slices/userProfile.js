import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";
import { selectUserData } from "../slices/auth";
// Define an initial state
const initialState = {
  data: null,
  status: "idle",
  error: null,
};

// Create an asynchronous thunk for fetching the user's profile data
export const fetchUserProfile = createAsyncThunk(
  "userProfile/fetchUserProfile",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


export const addFriend = createAsyncThunk(
    'userProfile/addFriend',
    async (friendId, { getState, rejectWithValue }) => {
      try {
        const { token } = selectUserData(getState()); 
        const response = await axios.post(`/friends/${friendId}`, null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
       
        return response.data;
      } catch (error) {
        return rejectWithValue(error.message || error.response.data.message);
      }
    }
  );
  


// Create a slice of the Redux store
const userProfileSlice = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addFriend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addFriend.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status = "idle";
        state.error = null;
      })
      .addCase(addFriend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export the reducer and actions
export const { logout } = userProfileSlice.actions;
export const userProfileReducer = userProfileSlice.reducer;

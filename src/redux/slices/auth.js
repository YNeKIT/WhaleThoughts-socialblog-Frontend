import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchAuth = createAsyncThunk(
  "auth/fetchAuth",
  async (params) => {
    const { data } = await axios.post("/auth/login", params);
    return data;
  }
);


export const fetchRegister = createAsyncThunk('auth/fetchRegister', async (params) => {
  const { data } = await axios.post('/auth/register', params);
  return data;
});



export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
  const { data } = await axios.get('/auth/me');
  return data;
});


export const uploadAvatar = createAsyncThunk('/upload/avatar', async (formData, { getState }) => {
  try {
    const { data } = await axios.post('/upload/avatar', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${getState().auth.data.token}`, 
      },
    });
    return data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
});



export const updateUserDescription = createAsyncThunk(
  'auth/updateUserDescription',
  async ({ description }, { getState }) => {
    try {
      const { data } = await axios.put('/user/description', { description }, {
        headers: {
          Authorization: `Bearer ${getState().auth.data.token}`,
        },
      });
      return data;
    } catch (error) {
      console.error("Error updating description:", error);
      throw error;
    }
  }
);



const initialState = {
  data: null,
  status: "loading",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers:{
logout: (state)=> {
    state.data = null;
}

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuth.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchAuth.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchAuth.rejected, (state) => {
        state.status = "error";
        state.data = null;
      })
      .addCase(fetchAuthMe.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchAuthMe.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchAuthMe.rejected, (state) => {
        state.status = "error";
        state.data = null;
      })
      .addCase(fetchRegister.pending, (state) => {
        state.status = "loading";
        state.data = null;
      })
      .addCase(fetchRegister.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data = action.payload;
      })
      .addCase(fetchRegister.rejected, (state) => {
        state.status = "error";
        state.data = null;
      })
      .addCase(uploadAvatar.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.status = "loaded";
        state.data.avatarUrl = action.payload.avatarUrl;
      })
      .addCase(uploadAvatar.rejected, (state) => {
        state.status = "error";
      })
      .addCase(updateUserDescription.fulfilled, (state, action) => {
      
        state.data.bio = action.payload.description;
      });


  },
});

export const selectIsAuth = (state) => Boolean(state.auth.data);
export const selectUserData = (state) => state.auth.data; 
export const authReducer = authSlice.reducer;

export const {logout} = authSlice.actions;

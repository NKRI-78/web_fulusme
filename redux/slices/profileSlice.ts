import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface ProfileState {
  fullname: string;
  loading: boolean;
}

const initialState: ProfileState = {
  fullname: "",
  loading: false,
};

export const updateProfileAsync = createAsyncThunk(
  "profile/updateProfile",
  async ({ fullname }: { fullname: string }) => {
    const response = await UpdateProfile(fullname);
    return response;
  },
);

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setFullname: (state, action) => {
      state.fullname = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateProfileAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfileAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProfileAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setFullname } = profileSlice.actions;

export default profileSlice.reducer;

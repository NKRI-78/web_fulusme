import { DashboardData } from "@/app/interfaces/dashboard/dashboard";
import { getDashboard } from "@/app/services/dashboard";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchDashboardClient = createAsyncThunk<
  DashboardData,
  void,
  { rejectValue: string }
>("dashboard/fetchDashboard", async (_, { rejectWithValue }) => {
  try {
    return await getDashboard();
  } catch {
    return rejectWithValue("Gagal mengambil dashboard investor");
  }
});

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardClient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardClient.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDashboardClient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Terjadi kesalahan";
      });
  },
});

export default dashboardSlice.reducer;

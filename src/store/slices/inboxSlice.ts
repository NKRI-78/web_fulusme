import { InboxResponse } from "@features/inbox/types";
import { listInbox } from "@features/inbox/services/inbox";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface InboxState {
  items: InboxResponse[];
  loading: boolean;
  error: string | null;
}

const initialState: InboxState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchInboxThunk = createAsyncThunk<
  InboxResponse[],
  void,
  { rejectValue: string }
>("inbox/fetchInbox", async (_, { rejectWithValue }) => {
  try {
    return await listInbox();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Gagal fetch inbox";
    return rejectWithValue(message);
  }
});

const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    updateInboxes(state, action) {
      state.items = action.payload;
    },
    clearInbox(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInboxThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchInboxThunk.fulfilled,
        (state, action: PayloadAction<InboxResponse[]>) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addCase(fetchInboxThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Terjadi kesalahan";
      });
  },
});

export const { clearInbox, updateInboxes } = inboxSlice.actions;
export default inboxSlice.reducer;

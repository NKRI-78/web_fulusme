import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchContentHistories, fetchContentList } from '@lib/contentService';
import { Content } from '@shared/types/content/content';
import { ContentHistory, ContentHistoryDataItem } from '@shared/types/content/content-history';

export const fetchContentListAsync = createAsyncThunk('content/list',
  async (search: string) => {
    const response = await fetchContentList(search);
    return response;
  }
);

export const fetchContentHistoryAsync = createAsyncThunk('content/histories',
  async () => {
    const response = await fetchContentHistories();
    return response;
  }
);

interface ContentState {
  contents: Content | null;
  contentHistories: ContentHistoryDataItem[];
  search: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  contents: null,
  contentHistories: [],
  search: "",
  isLoading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'contents',
  initialState,
  reducers: {
    setContents(state, action: PayloadAction<Content>) {
      state.contents = action.payload;
    },
    setContentHistories(state, action: PayloadAction<ContentHistoryDataItem[]>) {
      state.contentHistories = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContentListAsync.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchContentListAsync.fulfilled, (state, action) => {
        state.contents = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchContentListAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch content";
      })
      .addCase(fetchContentHistoryAsync.fulfilled, (state, action) => {
        state.contentHistories = action.payload;
      });
  },
});

export const { setContents, setSearch, setIsLoading, setError, setContentHistories } = contentSlice.actions;
export default contentSlice.reducer;

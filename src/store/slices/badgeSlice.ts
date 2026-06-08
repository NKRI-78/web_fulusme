import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BadgeState {
  badgeCount: number;
}

const initialState: BadgeState = {
  badgeCount: 0,
};

export const badgeSlice = createSlice({
  name: "badge",
  initialState,
  reducers: {
    setBadge: (state, action: PayloadAction<number>) => {
      state.badgeCount = action.payload;
    },
    resetBadge: (state) => {
      state.badgeCount = 0;
    },
  },
});

export const { setBadge, resetBadge } = badgeSlice.actions;

export default badgeSlice.reducer;

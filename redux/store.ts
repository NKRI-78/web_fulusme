import { configureStore } from "@reduxjs/toolkit";

import contentReducer from "@redux/slices/contentSlice";
import modalReducer from "@redux/slices/modalSlice";
import badgeReducer from "./slices/badgeSlice";
import inboxReducer from "./slices/inboxSlice";
import dashboardReducer from "./slices/dashboardSlice";

import { enableMapSet } from "immer";

enableMapSet();

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    content: contentReducer,
    badge: badgeReducer,
    inbox: inboxReducer,
    dashboard: dashboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

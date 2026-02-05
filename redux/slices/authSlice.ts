import { LoginModel } from "@interfaces/auth/login";
import { RegisterModel } from "@interfaces/auth/register";

import Cookies from "js-cookie";

import { LoginUser, RegisterUser } from "@lib/authService";
import {
  AsyncThunk,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AuthDataResponse, AuthResponse } from "@/app/interfaces/auth/auth";

export const loginAsync = createAsyncThunk<AuthResponse, { login: LoginModel }>(
  "auth/login",
  async ({ login }) => {
    return await LoginUser(login);
  },
);

export const registerAsync = createAsyncThunk<
  AuthResponse,
  { register: RegisterModel }
>("auth/register", async ({ register }) => {
  return await RegisterUser(register);
});

interface AuthState {
  loading: boolean;
  data: AuthDataResponse | null;
  isAuthenticated: boolean;
  showPassword: boolean;
  email: string;
  password: string;
  token: string | null;
  error: string | null;
}

const initialState: AuthState = {
  data: null,
  loading: false,
  isAuthenticated: false,
  showPassword: false,
  email: "",
  password: "",
  token: null,
  error: null,
};

const handleAuthAsyncThunk = <Returned, ThunkArg>(
  builder: any,
  asyncThunk: AsyncThunk<Returned, ThunkArg, object>,
  onFulfilled?: (state: AuthState, action: PayloadAction<Returned>) => void,
) => {
  builder
    .addCase(asyncThunk.pending, (state: AuthState) => {
      state.loading = true;
    })
    .addCase(
      asyncThunk.fulfilled,
      (state: AuthState, action: PayloadAction<Returned>) => {
        state.loading = false;
        state.isAuthenticated = true;
        if (onFulfilled) onFulfilled(state, action);
      },
    )
    .addCase(asyncThunk.rejected, (state: AuthState) => {
      state.loading = false;
    });
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setEmail(state, action: PayloadAction<string>) {
      state.email = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setShowPassword(state, action: PayloadAction<boolean>) {
      state.showPassword = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearToken(state) {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    logout(state) {
      state.token = null;
      state.data = null;
      state.isAuthenticated = false;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
      }
    },
    loadSession(state) {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("authToken");
        const user = localStorage.getItem("authUser");

        if (token && user) {
          state.token = token;
          state.data = JSON.parse(user);
          state.isAuthenticated = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    handleAuthAsyncThunk(builder, loginAsync, (_, action) => {
      if (typeof window !== "undefined") {
        Cookies.set("email", action.payload.data.email, {
          expires: 365,
          secure: true,
          sameSite: "strict",
        });
        localStorage.setItem("authToken", action.payload.data.token);
        localStorage.setItem("authUser", JSON.stringify(action.payload.data));
      }
    });

    handleAuthAsyncThunk(builder, registerAsync, (_, action) => {
      if (typeof window !== "undefined") {
        Cookies.set("email", action.payload.data.email, {
          expires: 365,
          secure: true,
          sameSite: "strict",
        });
        localStorage.setItem("authToken", action.payload.data.token);
        localStorage.setItem("authUser", JSON.stringify(action.payload.data));
      }
    });
  },
});

export const {
  setEmail,
  setLoading,
  setPassword,
  setShowPassword,
  setError,
  logout,
  loadSession,
} = authSlice.actions;
export default authSlice.reducer;

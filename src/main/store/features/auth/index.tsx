import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Slice,
} from "@reduxjs/toolkit";
import {api, clearToken} from "main/configs/axios.config";
import {CustomerDTO, UserDTO} from "main/models";
import {LoginDTO} from "main/types";

type AuthSliceType = {
  user: UserDTO | null;
  customer: CustomerDTO | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
};

const initialState: AuthSliceType = {
  user: null,
  customer: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
};

// Login user
export const login = createAsyncThunk(
  "auth/token",
  async (userDTO: LoginDTO, thunkAPI) => {
    const response: any = await api.post("auth/token", userDTO);
    if (response && response.user) {
      return response.user;
    }
    return null;
  }
);

// Get user
export const getUser = createAsyncThunk(
  "auth/user",
  async (undefined, thunkAPI) => {
    const response: any = await api.get("auth/user");
    if (response) {
      return response;
    }
    return null;
  }
);
// Get user
export const getCustomer = createAsyncThunk(
  "auth/customer",
  async (undefined, thunkAPI) => {
    const state: any = thunkAPI.getState();
    if (!state.auth.user || state.auth.user.role === "admin") return null;
    const response: any = await api.get("auth/customer");
    if (response) {
      return response;
    }
    return null;
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  clearToken();
});

export const authSlice: Slice<any> = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.user = null;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.user = null;
      })
      .addCase(getUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getCustomer.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCustomer.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.isError = true;
        state.user = null;
      })
      .addCase(getCustomer.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.customer = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      });
  },
});

export const {reset} = authSlice.actions;
export default authSlice.reducer;

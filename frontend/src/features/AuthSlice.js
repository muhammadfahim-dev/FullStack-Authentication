import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  error: null,
  success: false,
};

const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    start(state, action) {
      state.loading = true;
      state.error = null;
    },

    registerUser(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.success = true;
    },

    loginUser(state, action) {
      state.loading = false;
      state.user = action.payload;
      state.success = true;
    },

    authFail(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    logout(state, action) {
      state.user = null;
      state.error = null;
      state.loading = false;
      state.success = true;
    },
  },
});

export const { start, registerUser, loginUser, logout, authFail } =
  AuthSlice.actions;
export default AuthSlice.reducer;

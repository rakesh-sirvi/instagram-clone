import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
  name: "Auth",
  initialState: { user: null },
  reducers: {
    SET_USER: (state, { payload }) => {
      state.user = payload.user;
    },
  },
});

export const { SET_USER } = AuthSlice.actions;
export const AuthSelector = (state) => state.auth;

export default AuthSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

export const persistAuthedUser = () => {
  // Intentionally no persistence so hard navigations require a fresh login.
};

export const getAuthInitialState = () => ({
  authedUser: null,
});

const authSlice = createSlice({
  name: 'auth',
  initialState: getAuthInitialState(),
  reducers: {
    setAuthedUser(state, action) {
      state.authedUser = action.payload;
    },
    clearAuthedUser(state) {
      state.authedUser = null;
    },
  },
});

export const { setAuthedUser, clearAuthedUser } = authSlice.actions;

export const selectAuthedUser = (state) => state.auth.authedUser;

export default authSlice.reducer;

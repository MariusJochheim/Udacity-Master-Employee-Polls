import { createSlice } from '@reduxjs/toolkit';

export const AUTH_STORAGE_KEY = 'authedUser';

const getStoredAuthedUser = () => {
  if (typeof localStorage === 'undefined') {
    return null;
  }

  try {
    return localStorage.getItem(AUTH_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to read authed user from storage', error);
    return null;
  }
};

export const persistAuthedUser = (authedUser) => {
  if (typeof localStorage === 'undefined') {
    return;
  }

  try {
    if (authedUser) {
      localStorage.setItem(AUTH_STORAGE_KEY, authedUser);
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Failed to persist authed user', error);
  }
};

export const getAuthInitialState = () => ({
  authedUser: getStoredAuthedUser(),
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

import { configureStore } from '@reduxjs/toolkit';
import authReducer, { getAuthInitialState } from './authSlice';
import usersReducer from './usersSlice';
import questionsReducer from './questionsSlice';
import uiReducer from './uiSlice';

export const createAppStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      auth: authReducer,
      users: usersReducer,
      questions: questionsReducer,
      ui: uiReducer,
    },
    preloadedState: {
      ...preloadedState,
      auth: preloadedState.auth ?? getAuthInitialState(),
    },
  });

export const store = createAppStore();

export * from './authSlice';
export * from './usersSlice';
export * from './questionsSlice';
export * from './uiSlice';
export * from './thunks';

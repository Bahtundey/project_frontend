import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import pollsReducer from './pollsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    polls: pollsReducer,
  },
});

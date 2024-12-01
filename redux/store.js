// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from './slices/loaderSlice';

export const store = configureStore({
  reducer: {
    loader: loaderReducer, // Register your loader slice here
  },
});

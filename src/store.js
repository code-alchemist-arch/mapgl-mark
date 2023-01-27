import { configureStore } from '@reduxjs/toolkit';

import homeReducer from './features/home/homeSlice';

export const store = configureStore({
  reducer: {
    home: homeReducer,
  },
});

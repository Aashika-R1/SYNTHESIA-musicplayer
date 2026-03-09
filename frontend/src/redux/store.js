import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authslice.js';
import uireducer from './slices/uislice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uireducer,
  },
});

export default store;
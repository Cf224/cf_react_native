import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import subsReducer from './slices/subscriptionsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    subscriptions: subsReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

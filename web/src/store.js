import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './reducers/userReducer';
import notificationsReducer from './config/notificationsSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    notifications: notificationsReducer,
  },
});

export default store;

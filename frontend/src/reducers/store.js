import { configureStore } from '@reduxjs/toolkit';
import blogReducer from './blogReducer';
import notificationReducer from './notificationReducer';
import userReducer from './userReducer';
import usersReducer from './usersReducer';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
    users: usersReducer,
  },
});

export default store;

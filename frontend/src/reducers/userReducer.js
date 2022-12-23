import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import loginService from '../services/login';
import { setError } from './notificationReducer';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });
      blogService.setToken(user.token);
      user.tokenExpirationTimeStamp =
        user.tokenExpiresIn * 1000 + new Date().getTime();
      dispatch(setUser(user));
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
    } catch (error) {
      dispatch(setError(error.response.data.error));
      console.error(error.message);
    }
  };
};

export const loggedUser = (user) => {
  return async (dispatch) => {
    try {
      blogService.setToken(user.token);
      dispatch(setUser(user));
    } catch (error) {
      console.error(error.message);
    }
  };
};

export const logoutUser = () => {
  return (dispatch) => {
    dispatch(setUser(null));
    window.localStorage.clear();
    blogService.setToken(null);
  };
};

export default userSlice.reducer;

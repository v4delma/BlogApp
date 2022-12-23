import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';
import { setNotification, setError } from './notificationReducer';
import { logoutUser, setUser } from './userReducer';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: { blogs: [], loading: false },
  reducers: {
    loading(state) {
      state.loading = true;
    },
    addBlog(state, action) {
      state.blogs.push(action.payload);
    },
    setBlogs(state, action) {
      state.blogs = action.payload;
      state.loading = false;
    },
  },
});

export const { addBlog, setBlogs, loading } = blogSlice.actions;

export const getBlogs = () => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      const blogs = await blogService.getAll();
      dispatch(setBlogs(blogs));
    } catch (error) {
      dispatch(setError(error.message));
    }
  };
};

export const updatedBlogs = (id, blog) => {
  return async (dispatch) => {
    try {
      dispatch(loading());
      await blogService.update(id, blog);
      dispatch(getBlogs());
    } catch (error) {
      dispatch(setError(error.message));
      console.error(error.message);
    }
  };
};

export const deleteBlog = (id, blogToRemove) => {
  return async (dispatch) => {
    try {
      await blogService.destroy(id);
      dispatch(setNotification(`${blogToRemove.title} removed`));
      dispatch(getBlogs());
    } catch (error) {
      if (error.response.data.error === 'Token expired, logging out...') {
        dispatch(setError(error.response.data.error));
        console.error(error.message);
        setTimeout(() => {
          dispatch(setUser(null));
          window.localStorage.clear();
        }, 3000);
      } else {
        dispatch(setError(error.response.data.error));
        console.error(error.message);
      }
    }
  };
};

export const createBlog = (newBlog) => {
  return async (dispatch) => {
    try {
      const createdBlog = await blogService.create(newBlog);
      dispatch(addBlog(createdBlog));
      dispatch(
        setNotification(
          `a new blog ${createdBlog.title} by ${createdBlog.author} added`
        )
      );
    } catch (error) {
      if (error.response.data.error === 'Token expired, logging out...') {
        dispatch(setError(error.response.data.error));
        setTimeout(() => {
          dispatch(logoutUser());
        }, 3000);
      } else {
        dispatch(setError(error.response.data.error));
        console.error(error.message);
      }
    }
  };
};

export const addComment = (id, comment) => {
  return async (dispatch) => {
    try {
      await blogService.comment(id, comment);
      dispatch(getBlogs());
    } catch (error) {
      console.error(error.message);
    }
  };
};

export default blogSlice.reducer;

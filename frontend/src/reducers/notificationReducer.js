import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { notification: null, error: null },
  reducers: {
    showNotification(state, action) {
      state.notification = action.payload;
    },
    resetNotification(state) {
      state.notification = null;
    },
    showError(state, action) {
      state.error = action.payload;
    },
    resetError(state) {
      state.error = null;
    },
  },
});

export const setNotification = (message) => {
  return (dispatch) => {
    dispatch(showNotification(message));
    setTimeout(() => {
      dispatch(resetNotification());
    }, 3000);
  };
};

export const setError = (message) => {
  return (dispatch) => {
    dispatch(showError(message));
    setTimeout(() => {
      dispatch(resetError());
    }, 3000);
  };
};

export const { showNotification, resetNotification, showError, resetError } =
  notificationSlice.actions;
export default notificationSlice.reducer;

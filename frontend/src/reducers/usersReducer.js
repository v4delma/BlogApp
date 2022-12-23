import { createSlice } from '@reduxjs/toolkit';
import userService from '../services/users';

const usersSlice = createSlice({
  name: 'users',
  initialState: { users: [] },
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = usersSlice.actions;

export const getUsers = () => {
  return async (dispatch) => {
    try {
      const users = await userService.getAll();
      dispatch(setUsers(users));
    } catch (error) {
      console.error(error.message);
    }
  };
};
export default usersSlice.reducer;

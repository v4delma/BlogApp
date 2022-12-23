import axios from 'axios';
const baseUrl = '/api/users';

const getAll = async () => {
  const users = await axios.get(baseUrl);
  return users.data;
};

const userService = {
  getAll,
};

export default userService;

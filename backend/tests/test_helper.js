const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
  {
    title: 'TESTIBLOGI_YKSI',
    author: 'Valtteri Lakanen',
    url: 'www.vadelmanblogi.fi',
    likes: 1,
  },
  {
    title: 'TESTIBLOGI_KAKSI',
    author: 'Valtteri Lakanen',
    url: 'www.vadelmanblogi.fi',
    likes: 2,
  },
];

const initialUsers = [
  {
    username: 'Testaaja',
    name: 'Teppo',
    password: 'testi',
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'turha',
    author: 'test',
    url: 'www',
    likes: 0,
  });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  initialUsers,
};

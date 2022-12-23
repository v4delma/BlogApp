import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import Error from './components/Error';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import {
  getBlogs,
  updatedBlogs,
  deleteBlog,
  createBlog,
  addComment,
} from './reducers/blogReducer';
import { login, loggedUser, logoutUser } from './reducers/userReducer';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Users from './components/Users';
import User from './components/User';
import { getUsers } from './reducers/usersReducer';
import Navi from './components/Nav';
import Blogs from './components/Blogs';
import Logout from './components/Logout';
import { setError } from './reducers/notificationReducer';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [blogFormVisible, setBlogFormVisible] = useState(false);

  const dispatch = useDispatch();

  const notification = useSelector((state) => {
    return state.notification.notification;
  });

  const errorMsg = useSelector((state) => {
    return state.notification.error;
  });

  const blogs = useSelector((state) => {
    const copyOfBlogs = [...state.blogs.blogs];
    return copyOfBlogs.sort((a, b) => b.likes - a.likes);
  });

  const likeButtonDisabled = useSelector((state) => {
    return state.blogs.loading;
  });

  const user = useSelector((state) => {
    return state.user;
  });

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (user && new Date().getTime() > user.tokenExpirationTimeStamp) {
        dispatch(setError('Session expired, logging out...'));
        setTimeout(() => {
          handleLogout();
        }, 3000);
      }
    }, 5000);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    dispatch(getBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(loggedUser(user));
    }
  }, []);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  const handleLogin = (event) => {
    event.preventDefault();
    dispatch(login(username, password));
    setUsername('');
    setPassword('');
  };

  const handleCreateBlog = (newBlog) => {
    dispatch(createBlog(newBlog));
    setBlogFormVisible(false);
  };

  const addCommentToBlog = (id, comment) => {
    dispatch(addComment(id, comment));
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    setBlogFormVisible(false);
    navigate('/');
  };

  const handleAddLike = async (id, blog) => {
    dispatch(updatedBlogs(id, blog));
  };

  const handleDestroyBlog = (id) => {
    const blogToRemove = blogs.find((blog) => blog.id === id);
    if (
      window.confirm(
        `remove blog ${blogToRemove.title} by ${blogToRemove.author}`
      )
    ) {
      dispatch(deleteBlog(id, blogToRemove));
    }
  };

  if (user === null) {
    return (
      <div className="container">
        <Error error={errorMsg} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <Logout user={user} logout={handleLogout} />
      <Navi />

      <Error error={errorMsg} />
      <Notification message={notification} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <BlogForm
                createBlog={handleCreateBlog}
                handleBlogFormVisible={setBlogFormVisible}
                blogFormVisible={blogFormVisible}
              />
              <Blogs blogs={blogs} />
            </>
          }
        />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:userId" element={<User />} />
        <Route
          path="/blogs/:blogId"
          element={
            <Blog
              likeButtonDisabled={likeButtonDisabled}
              addLike={handleAddLike}
              remove={handleDestroyBlog}
              user={user}
              addComment={addCommentToBlog}
            />
          }
        ></Route>
      </Routes>
    </div>
  );
};
export default App;

/* {blogs.map((blog) => (
  <Blog
    key={blog.id}
    likeButtonDisabled={likeButtonDisabled}
    blog={blog}
    addLike={handleAddLike}
    remove={handleDestroyBlog}
    user={user}
  />
))} */

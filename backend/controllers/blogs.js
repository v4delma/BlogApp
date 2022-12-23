const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const user = await User.findById(request.user.id);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user,
  });

  try {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog.toJSON());
  } catch (e) {
    console.error(e.message);
    response.status(400).json({ error: 'title or url missing' });
  }
});

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = await User.findById(request.user.id);
    const blog = await Blog.findById(request.params.id);

    if (!blog) {
      return response.status(401).json({ error: 'blog already deleted' });
    }

    if (blog.user.toString() === request.user.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id);
      user.blogs = user.blogs.filter(
        (blog) => blog.toString() !== request.params.id
      );
      await user.save();
      response.status(204).end();
    } else {
      return response.status(401).json({ error: 'wrong user' });
    }
  }
);

blogsRouter.put('/:id', async (request, response) => {
  const modifiedBlog = request.body;
  const update = await Blog.findByIdAndUpdate(request.params.id, modifiedBlog, {
    new: true,
  });
  response.status(200).json(update);
});

blogsRouter.post('/:id/comments', async (request, response) => {
  const comment = request.body;
  const blog = await Blog.findById(request.params.id);
  const blogWithComment = {
    ...blog._doc,
    comments: [...blog.comments, comment.comment],
  };
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blogWithComment,
    { new: true }
  );
  response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;

/* blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then((result) => {
    response.status(201).json(result);
  });
}); */

/* blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);

  const savedBlog = blog.save();
  response.status(201).json(savedBlog);
}); */

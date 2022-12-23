const dummy = (blogs) => {
  console.log('dummy test - zero blogs:', blogs);
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((total, likes) => total + likes.likes, 0);
};

const favoriteBlog = (blogs) => {
  const mostLikes = Math.max(...Array.from(blogs, (b) => b.likes));
  const blogWithMostLikes = blogs.find((b) => b.likes === mostLikes);
  return blogWithMostLikes;
};

const mostBlogs = (blogs) => {
  const authors = [];
  for (const blog of blogs) {
    if (!authors.find((x) => x.author === blog.author)) {
      authors.push({ author: blog.author, blogs: 1 });
    } else {
      authors[authors.indexOf(authors.find((x) => x.author === blog.author))]
        .blogs++;
    }
  }
  const maxBlogs = Math.max(...Array.from(authors, (b) => b.blogs));
  const authorWithMostBlogs = authors.find((b) => b.blogs === maxBlogs);
  return authorWithMostBlogs;
};

const mostLikes = (blogs) => {
  const authors = [];
  for (const blog of blogs) {
    if (!authors.find((x) => x.author === blog.author)) {
      authors.push({ author: blog.author, likes: blog.likes });
    } else {
      authors[
        authors.indexOf(authors.find((x) => x.author === blog.author))
      ].likes += blog.likes;
    }
  }
  const maxLikes = Math.max(...Array.from(authors, (b) => b.likes));
  const authorWithMostLikes = authors.filter((b) => b.likes === maxLikes);
  return authorWithMostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};

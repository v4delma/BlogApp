import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';

const NewBlog = ({ createBlog, handleBlogFormVisible, blogFormVisible }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setURL] = useState('');

  const handleCreateBlog = async (event) => {
    event.preventDefault();

    createBlog({
      title,
      author,
      url,
    });

    setTitle('');
    setAuthor('');
    setURL('');
  };

  const hideWhenVisible = { display: blogFormVisible ? 'none' : '' };
  const showWhenVisible = { display: blogFormVisible ? '' : 'none' };

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={hideWhenVisible}>
        <Button onClick={() => handleBlogFormVisible(true)}>
          Create a new blog
        </Button>
      </div>
      <div style={showWhenVisible} className="blog-form">
        <h2>Create new</h2>
        <form onSubmit={handleCreateBlog}>
          <div>
            Title:
            <input
              id="title-input"
              type="text"
              value={title}
              name="Title"
              onChange={({ target }) => setTitle(target.value)}
              placeholder="title"
              className="blog-form-input"
            />
          </div>
          <div>
            Author:
            <input
              id="author-input"
              type="text"
              value={author}
              name="Author"
              onChange={({ target }) => setAuthor(target.value)}
              placeholder="author"
              className="blog-form-input"
            />
          </div>
          <div>
            URL:
            <input
              id="url-input"
              type="text"
              value={url}
              name="URL"
              onChange={({ target }) => setURL(target.value)}
              placeholder="url with 'https://...'"
              className="blog-form-input"
            />
          </div>
          <Button style={{ marginTop: 5 }} variant="primary" type="submit">
            Create
          </Button>
          <Button
            style={{ marginTop: 5, marginLeft: 5 }}
            variant="secondary"
            type="button"
            onClick={() => handleBlogFormVisible(false)}
          >
            Cancel
          </Button>
        </form>
      </div>
    </div>
  );
};

NewBlog.propTypes = {
  createBlog: PropTypes.func.isRequired,
  handleBlogFormVisible: PropTypes.func.isRequired,
  blogFormVisible: PropTypes.bool.isRequired,
};

export default NewBlog;

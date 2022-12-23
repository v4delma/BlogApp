import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import BlogForm from './BlogForm';

describe('Testing Blog component', () => {
  test('renders blog title and author, but no url or likes', () => {
    const newBlog = {
      title: 'New Blog For Testing',
      author: 'valtteri',
      url: 'www.test.com',
      likes: 10,
      user: {
        username: 'vlakan',
      },
    };

    const user = {
      username: 'vlakan',
    };

    const container = render(<Blog blog={newBlog} user={user} />).container;
    const titleAndAuthor = container.querySelector('.blog');
    const blogDetailsDiv = container.querySelector('.blog-details');
    expect(titleAndAuthor).toHaveStyle('display: block');
    expect(blogDetailsDiv).toHaveStyle('display: none');
    expect(titleAndAuthor).toHaveTextContent('New Blog For Testing');
    expect(titleAndAuthor).toHaveTextContent('valtteri');
    expect(titleAndAuthor).not.toHaveTextContent('www.test.com');
    expect(titleAndAuthor).not.toHaveTextContent('likes');

    /*   const title = screen.getAllByText(newBlog.title, { exact: false });
    expect(title).toBeDefined(); */
  });

  test('url and likes are also shown after clicking view button', async () => {
    const newBlog = {
      title: 'New Blog For Testing',
      author: 'valtteri',
      url: 'www.test.com',
      likes: 10,
      user: {
        username: 'vlakan',
      },
    };

    const blogUser = {
      username: 'vlakan',
    };

    const container = render(<Blog blog={newBlog} user={blogUser} />).container;

    const user = userEvent.setup();
    const button = screen.getByText('view');
    await user.click(button);

    const blogDetailsDiv = container.querySelector('.blog-details');
    const titleAndAuthor = container.querySelector('.blog');
    expect(titleAndAuthor).toHaveStyle('display: none');
    expect(blogDetailsDiv).toHaveStyle('display: block');
    expect(blogDetailsDiv).toHaveTextContent('New Blog For Testing');
    expect(blogDetailsDiv).toHaveTextContent('valtteri');
    expect(blogDetailsDiv).toHaveTextContent('www.test.com');
    expect(blogDetailsDiv).toHaveTextContent('likes');
  });

  test('clicking like button twice will cause calling addLike function twice', async () => {
    const newBlog = {
      title: 'New Blog For Testing',
      author: 'valtteri',
      url: 'www.test.com',
      likes: '10',
      user: {
        username: 'vlakan',
      },
    };

    const blogUser = {
      username: 'vlakan',
    };

    const mockHandler = jest.fn();

    render(<Blog blog={newBlog} user={blogUser} addLike={mockHandler} />)
      .container;

    const user = userEvent.setup();
    const button = screen.getByText('like');
    await user.click(button);
    await user.click(button);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});

describe('Testing BlogForm component', () => {
  test('BlogForm component calls callback function with right information', async () => {
    const user = userEvent.setup();
    const createBlog = jest.fn();

    render(
      <BlogForm
        createBlog={createBlog}
        handleBlogFormVisible={() => {}}
        blogFormVisible={true}
      />
    ).container;

    const inputTitle = screen.getByPlaceholderText('title');
    const inputAuthor = screen.getByPlaceholderText('author');
    const inputUrl = screen.getByPlaceholderText('url');
    const createButton = screen.getByText('create');

    await user.type(inputTitle, 'This is a new blog');
    await user.type(inputAuthor, 'Vadelma');
    await user.type(inputUrl, 'www.vadelmastestblog.com');
    await user.click(createButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0].title).toBe('This is a new blog');
    expect(createBlog.mock.calls[0][0].author).toBe('Vadelma');
    expect(createBlog.mock.calls[0][0].url).toBe('www.vadelmastestblog.com');
  });
});

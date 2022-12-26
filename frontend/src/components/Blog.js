import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Comments from './Comments';
import { Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Blog = (props) => {
  const params = useParams();
  const navigate = useNavigate();

  const blogs = useSelector((state) => state.blogs.blogs);
  const blog = blogs.find((b) => b.id === params.blogId);

  if (!blog) {
    return null;
  }

  const like = (event) => {
    event.preventDefault();
    props.addLike(blog.id, {
      user: blog.user.id,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    });
  };

  const removeBlog = (event) => {
    event.preventDefault();
    props.remove(blog.id, props.user.token);
    navigate('/');
  };

  return (
    <div>
      <Card>
        <Card.Header>
          <strong>{blog.title}</strong> by <strong>{blog.author}</strong>
        </Card.Header>
        <Card.Body>
          <Card.Title>
            <div>
              <a href={blog.url}>{blog.url}</a>
            </div>
          </Card.Title>
          <Card.Text>
            <div>{blog.likes} likes</div>
            <Button onClick={like} disabled={props.likeButtonDisabled}>
              Like
            </Button>
            {blog.user.username === props.user.username && (
              <Button
                variant="secondary"
                onClick={removeBlog}
                style={{ marginLeft: 5 }}
              >
                Remove
              </Button>
            )}
          </Card.Text>
          <footer>
            <Comments
              comments={blog.comments}
              addComment={props.addComment}
              blogId={blog.id}
            />
          </footer>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Blog;

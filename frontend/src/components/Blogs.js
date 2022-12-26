import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';

const Blogs = ({ blogs }) => {
  return (
    <div>
      <h2 className="mt-4">Blogs</h2>
      <ListGroup>
        {blogs.map((blog) => (
          <ListGroup.Item key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Blogs;

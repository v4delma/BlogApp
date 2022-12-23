import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';

const User = () => {
  const params = useParams();

  const users = useSelector((state) => state.users.users);
  const user = users.find((u) => u.id === params.userId);

  if (!user) {
    return null;
  }

  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>{user.name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">Added blogs</Card.Subtitle>
        </Card.Body>
        <ListGroup className="list-group-flush">
          {user.blogs.map((b) => (
            <ListGroup.Item key={b.title}>{b.title}</ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
};

export default User;

import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Table } from 'react-bootstrap';

const Users = () => {
  const users = useSelector((state) => state.users.users);

  return (
    <div>
      <h2>Users</h2>
      <Table striped>
        <tbody>
          <tr>
            <th style={{ textAlign: 'left' }}>Name</th>
            <th>Blogs created</th>
          </tr>
          {users.map((u) => (
            <tr key={u.username}>
              <td>
                <Link to={`/users/${u.id}`}>{u.name}</Link>
              </td>
              <td>{u.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;

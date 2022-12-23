import { Button } from 'react-bootstrap';

const Logout = ({ user, logout }) => {
  return (
    <div className="username-and-logout">
      {user.name} logged in
      <Button variant="secondary" onClick={logout} style={{ marginLeft: 10 }}>
        Logout
      </Button>
    </div>
  );
};
export default Logout;

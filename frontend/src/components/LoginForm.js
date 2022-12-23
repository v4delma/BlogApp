import PropTypes from 'prop-types';
import { Form, Button } from 'react-bootstrap';

const LoginForm = ({
  handleLogin,
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
}) => {
  return (
    <div className="container">
      <h2>Login</h2>
      <Form onSubmit={handleLogin} style={{ marginTop: 20 }}>
        <Form.Group>
          <Form.Label htmlFor="username">Username:</Form.Label>
          <Form.Control
            id="username"
            type="text"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
          />
          <Form.Label htmlFor="password">Password:</Form.Label>
          <Form.Control
            id="password"
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
          />
          <Button variant="primary" type="submit" style={{ marginTop: 20 }}>
            Login
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
};

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
};

export default LoginForm;

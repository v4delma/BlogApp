import { Alert } from 'react-bootstrap';

const Error = ({ error }) => {
  if (error === null) {
    return null;
  }

  return <Alert variant="danger">{error}</Alert>;
};

export default Error;

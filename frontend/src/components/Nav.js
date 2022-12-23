import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const Navi = () => {
  return (
    <Navbar bg="light" expand="lg" style={{ marginTop: 10, marginBottom: 20 }}>
      <Container>
        <Navbar.Brand href="/">Blog App</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Blogs</Nav.Link>
            <Nav.Link href="/users">Users</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navi;

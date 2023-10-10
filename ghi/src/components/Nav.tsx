import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

const Navigation = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <LinkContainer to="/">
        <Navbar.Brand>Home</Navbar.Brand>
      </LinkContainer>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavDropdown title="Submissions" id="submissionDropdown">
            <LinkContainer to="/submissions">
              <NavDropdown.Item>All Submissions</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/submissions/new">
              <NavDropdown.Item>New Submission</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Divider />
          </NavDropdown>

          <NavDropdown title="Problems" id="problemDropdown">
            <LinkContainer to="/problems">
              <NavDropdown.Item>All Problems</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/problems/new">
              <NavDropdown.Item>New Problem</NavDropdown.Item>
            </LinkContainer>
            <NavDropdown.Divider />
            {/* <LinkContainer to="/notes">
              <NavDropdown.Item>View Notes</NavDropdown.Item>
            </LinkContainer>
            <LinkContainer to="/notes/new">
              <NavDropdown.Item>New Note</NavDropdown.Item>
            </LinkContainer> */}
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;

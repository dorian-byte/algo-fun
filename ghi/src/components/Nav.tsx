import { Link } from 'react-router-dom';
import './Nav.css';

const Nav = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="nav-link">
        Home
      </Link>
      <Link to="/submissions" className="nav-link">
        Submissions
      </Link>
      <Link to="/submissions/new" className="nav-link">
        New Submission
      </Link>
      <Link to="/problems" className="nav-link">
        Problems
      </Link>
    </nav>
  );
};

export default Nav;

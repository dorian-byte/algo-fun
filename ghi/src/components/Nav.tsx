import { Link } from 'react-router-dom';
import Logo from '../../public/journal-bookmark-icon-c9701d.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPuzzlePiece,
  faPaperPlane,
  faBook,
  faPlus,
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from './Breadcrumb';

const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="d-flex">
        <Link to="/" className="navbar-brand">
          <img src={Logo} width="30" height="30" alt="Logo" />
        </Link>
        {/* for collapsing
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button> */}
        <Breadcrumb />
      </div>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link to="/problems" className="nav-link">
              <FontAwesomeIcon icon={faPuzzlePiece} /> Problems
            </Link>
          </li>
          <li className="nav-item d-flex align-items-center gap-1 ms-3">
            <Link to="/submissions" style={{ textDecoration: 'None' }}>
              <FontAwesomeIcon icon={faPaperPlane} /> Submissions
            </Link>
            <Link to="/submissions/new">
              <FontAwesomeIcon icon={faPlus} />
            </Link>
          </li>
          <li className="nav-item d-flex align-items-center gap-1 ms-4">
            <Link to="/notes" style={{ textDecoration: 'None' }}>
              <FontAwesomeIcon icon={faBook} /> Notes
            </Link>
            <Link to="/notes/new">
              <FontAwesomeIcon icon={faPlus} />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

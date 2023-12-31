import { Link } from 'react-router-dom';
// import Logo from '../../public/journal-bookmark-icon-c9701d.svg';
import Logo from '../assets/images/logo2.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPuzzlePiece,
  faPaperPlane,
  faBook,
  faPlusCircle,
  faTags,
} from '@fortawesome/free-solid-svg-icons';
import Breadcrumb from './Breadcrumb';

const Navigation = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="d-flex">
        <Link to="/" className="navbar-brand">
          <img src={Logo} width="50" height="50" alt="Logo" />
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
              <FontAwesomeIcon icon={faPuzzlePiece} className="me-1" /> Problems
            </Link>
          </li>
          <li className="nav-item d-flex align-items-center gap-2 ms-5">
            <Link to="/submissions" style={{ textDecoration: 'None' }}>
              <FontAwesomeIcon icon={faPaperPlane} className="me-1" />{' '}
              Submissions
            </Link>
            <Link to="/submissions/new">
              <FontAwesomeIcon icon={faPlusCircle} fontSize={18} />
            </Link>
          </li>
          <li className="nav-item d-flex align-items-center gap-2 ms-5">
            <Link to="/notes" style={{ textDecoration: 'None' }}>
              <FontAwesomeIcon icon={faBook} className="me-1" /> Notes
            </Link>
          </li>
          <li className="nav-item d-flex align-items-center gap-2 ms-5">
            <Link to="/tags" style={{ textDecoration: 'None' }}>
              <FontAwesomeIcon icon={faTags} className="me-1" /> Tags
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;

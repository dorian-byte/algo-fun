import Image404 from '../assets/images/404.jpeg';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">Page not found</p>
      <img className="not-found-image" src={Image404} alt="404 Not Found"></img>
    </div>
  );
};

export default NotFoundPage;

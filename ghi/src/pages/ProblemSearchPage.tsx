import ProblemSearch from '../components/ProblemSearch';

const ProblemSearchPage: React.FC = () => {
  return (
    <div className="position-relative main" id="problem-search-container">
      <div className="position-absolute top-50 start-50 translate-middle w-50 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-4 text-center headline">Algo Journal</h1>
        <ProblemSearch />
      </div>
    </div>
  );
};

export default ProblemSearchPage;

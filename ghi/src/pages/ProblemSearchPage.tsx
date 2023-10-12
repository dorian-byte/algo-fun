import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { gql, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ALL_PROBLEMS = gql`
  query AllProblems {
    allProblems {
      id
      title
      leetcodeNumber
    }
  }
`;

const ProblemSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([] as any[]);

  const { loading, error, data } = useQuery(ALL_PROBLEMS);

  useEffect(() => {
    if (data) {
      console.log(data);
      setProblems(data.allProblems);
    }
  }, [data]);

  if (error) return <p>Error :( {error.message}</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="position-relative main">
      <div className="position-absolute top-50 start-50 translate-middle w-50 d-flex flex-column justify-content-center align-items-center">
        <h1 className="mb-5 text-center headline">Algo Journal</h1>
        <div className="w-50">
          <Typeahead
            id="problemTypeahead"
            labelKey={(option: any) =>
              `${option.leetcodeNumber} ${option.title}`
            }
            options={problems as any[]}
            placeholder="Choose a LeetCode problem..."
            onChange={(selectedProblem: any) => {
              // console.log(selectedProblem);
              if (selectedProblem.length > 0) {
                navigate(`/problems/${selectedProblem[0].id}`);
              }
            }}
            renderMenuItemChildren={(option: any) => (
              <div>
                {option.leetcodeNumber}. {option.title}
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default ProblemSearchPage;

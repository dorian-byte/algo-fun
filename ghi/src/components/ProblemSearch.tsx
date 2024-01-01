import { useEffect, useState } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { gql, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Search } from 'react-bootstrap-icons';

const ALL_PROBLEMS = gql`
  query AllProblems {
    allProblems {
      id
      title
      leetcodeNumber
    }
  }
`;

const ProblemSearch: React.FC = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([] as any[]);
  const { loading, error, data } = useQuery(ALL_PROBLEMS);

  useEffect(() => {
    if (data) {
      setProblems(data.allProblems);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  return (
    <div
      className="input-group"
      id="search-problem-input"
      style={{ position: 'relative' }}
    >
      <Search
        style={{
          width: 25,
          height: 25,
          position: 'absolute',
          right: 15,
          zIndex: 99,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
      <Typeahead
        id="problem-search-typeahead"
        labelKey={(problem: any) =>
          `${problem.leetcodeNumber} ${problem.title}`
        }
        options={problems}
        placeholder="Choose a LeetCode problem..."
        onChange={(selectedProblem: any) => {
          if (selectedProblem.length > 0) {
            navigate(`/problems/${selectedProblem[0].id}`);
          }
        }}
        renderMenuItemChildren={(problem: any) => (
          <div>
            {problem.leetcodeNumber}. {problem.title}
          </div>
        )}
      />
    </div>
  );
};

export default ProblemSearch;

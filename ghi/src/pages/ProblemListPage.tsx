import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import ProblemList from '../components/ProblemList';

const ALL_PROBLEMS = gql`
  query AllProblems {
    allProblems {
      id
      title
      leetcodeNumber
      description
      createdAt
      updatedAt
      difficulty
      timeComplexityRequirement
      spaceComplexityRequirement
      submissions {
        id
      }
      notes {
        id
      }
      resources {
        id
      }
      companies {
        id
        name
      }
      topics {
        id
        name
      }
      url
      lintcodeEquivalentProblemNumber
      lintcodeEquivalentProblemUrl
      submissions {
        passed
      }
    }
  }
`;

const ProblemListPage = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string | null>(null);

  const { loading, error, data } = useQuery(ALL_PROBLEMS);

  useEffect(() => {
    if (data) {
      // console.log(data);
      setProblems(data.allProblems);
      setFilteredProblems(data.allProblems);
    }
  }, [data]);

  useEffect(() => {
    if (difficultyFilter) {
      const result = problems.filter(
        (pb: any) => pb.difficulty === difficultyFilter
      );
      setFilteredProblems(result);
    } else {
      setFilteredProblems(problems);
    }
  }, [difficultyFilter, problems]);

  if (error) return <p>Error :( {error.message}</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div id="problemlist">
      <div
        id="problemlist-header"
        className="container d-flex flex-row justify-content-between align-items-center"
      >
        <h2 className="page-header">Problems</h2>

        <div className="d-flex flex-row align-items-center gap-3">
          <select
            value={difficultyFilter || ''}
            onChange={(e) => setDifficultyFilter(e.target.value || null)}
            className="btn btn-outline-primary"
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </select>
          <button
            className="btn btn-outline-primary btn-sm"
            style={{ height: 30, width: 30 }}
            onClick={() => navigate('/problems/new')}
          >
            +
          </button>
        </div>
      </div>
      <div className="main container" id="problemlist-bottom">
        <ProblemList problems={filteredProblems} />
      </div>
    </div>
  );
};

export default ProblemListPage;

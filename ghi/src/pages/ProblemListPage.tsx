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
      companies {
        id
        name
      }
      topics {
        id
        name
      }
      source {
        id
        name
      }
      url
      lintcodeEquivalentProblemNumber
      lintcodeEquivalentProblemUrl
      submissions {
        proficiencyLevel
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
    <div className="container">
      <div className="mb-4">
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
      </div>
      <div className="table-header mb-5">
        <h2 className="mb-4">All Problems</h2>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigate('/problems/new')}
        >
          New Problem
        </button>
      </div>
      <ProblemList problems={filteredProblems} />
    </div>
  );
};

export default ProblemListPage;

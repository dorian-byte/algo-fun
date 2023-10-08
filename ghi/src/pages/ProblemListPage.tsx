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
    <div className="container">
      <div className="table-header mb-5">
        <h2 className="mb-4">All Problems</h2>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={() => navigate('/problems/new')}
        >
          New Problem
        </button>
      </div>
      <ProblemList problems={problems} />
    </div>
  );
};

export default ProblemListPage;

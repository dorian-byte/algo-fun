import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

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
      <div className="row">
        {problems.map((pb: any) => (
          <div
            key={pb.id}
            onClick={() => {
              navigate(`/problems/${pb.id}`);
            }}
          >
            {pb.leetcodeNumber} {pb.title}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemListPage;

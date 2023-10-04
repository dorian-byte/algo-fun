import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

const PROBLEM_BY_ID = gql`
  query ProblemById($id: Int!) {
    problemById(id: $id) {
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

const ProblemDetailPage = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState({});
  const { loading, error, data } = useQuery(PROBLEM_BY_ID, {
    variables: { id: parseInt(id) },
  });
  useEffect(() => {
    if (data) {
      console.log(data);
      setProblem(data.problemById);
    }
  }, [data]);
  if (error) return <p>Error :( {error.message}</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <div>
      <div>ProblemDetailPage</div>
      <div>{problem.leetcodeNumber} </div>
      <div>{problem.title}</div>
      <div>{problem.description}</div>
    </div>
  );
};

export default ProblemDetailPage;

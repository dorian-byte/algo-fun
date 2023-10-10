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
  const { problemId } = useParams();
  const [problem, setProblem] = useState({} as any);
  const { loading, error, data } = useQuery(PROBLEM_BY_ID, {
    // NOTE: cannot just pass id: id, because id is string
    variables: { id: problemId ? +problemId : 0 },
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

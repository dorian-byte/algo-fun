import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import CodeEditor from '../components/CodeEditor';

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
      <h1>
        Problem Detail for {problem.leetcodeNumber}. {problem.title}
      </h1>
      <CodeEditor
        text={problem.description}
        language="markdown"
        showLineNumbers={false}
        theme="vs-dark"
      />
    </div>
  );
};

export default ProblemDetailPage;

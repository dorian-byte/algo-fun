import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import SubmissionList, { Submission } from '../components/SubmissionList';

const PROBLEM_SUBMISSIONS = gql`
  query ProblemSubmissions($problemId: ID!) {
    problemSubmissions(problemId: $problemId) {
      id
      problem {
        leetcodeNumber
        title
      }
      code
      duration
      isSolution
      isWhiteboardMode
      isInterviewMode
      methods {
        name
      }
      proficiencyLevel
      passed
      submittedAt
    }
  }
`;

//NOTE: here we can only use "{ problemId }: { problemId?: string }" instead of useParams() because the problemId will for sure be passed;
// otherwise, we have to use useParams() to get the problemId
// Also NOTE that the question mark in the type definition is a must-add; it means that the prop is optional
// otherwise in App.tsx, the compiler will complain that the prop is not present
const ProblemSubmissionListPage = ({ problemId }: { problemId?: string }) => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { loading, error, data } = useQuery(PROBLEM_SUBMISSIONS, {
    variables: { id: problemId ? +problemId : 0 },
  });

  useEffect(() => {
    if (data) {
      // console.log(data);
      setSubmissions(data.problemSubmissions);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-light">
        {submissions[0]?.problem?.leetcodeNumber}
        {'. '}
        {submissions[0]?.problem?.title}
      </h2>
      <SubmissionList submissions={submissions} showProblem={false} />
    </div>
  );
};

export default ProblemSubmissionListPage;

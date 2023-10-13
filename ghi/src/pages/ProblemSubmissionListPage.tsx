import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import SubmissionList, { Submission } from '../components/SubmissionList';
import { useParams } from 'react-router-dom';

const PROBLEM_SUBMISSIONS = gql`
  query submissionsByProblemId($problemId: Int!) {
    submissionsByProblemId(problemId: $problemId) {
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
const ProblemSubmissionListPage = () => {
  const { problemId } = useParams<{ problemId?: string }>();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { loading, error, data } = useQuery(PROBLEM_SUBMISSIONS, {
    variables: { problemId: problemId ? +problemId : 0 },
  });

  useEffect(() => {
    if (data?.submissionsByProblemId) {
      console.log('pid', problemId);
      console.log('dta', data);
      setSubmissions(data.submissionsByProblemId);
    }
  }, [data, problemId]);

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

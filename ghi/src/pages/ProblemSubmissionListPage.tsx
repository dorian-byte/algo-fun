import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import SubmissionList, { Submission } from '../components/SubmissionList';
import { useParams } from 'react-router-dom';

const PROBLEM_SUBMISSIONS = gql`
  query problemSubmissions($id: Int!) {
    problemById(id: $id) {
      title
      leetcodeNumber
      submissions {
        id
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
    variables: { id: problemId ? +problemId : 0 },
  });

  useEffect(() => {
    if (data?.problemById) {
      console.log('pid', problemId);
      console.log('dta', data);
      setSubmissions(data.problemById.submissions);
    }
  }, [data, problemId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :( {error.message}</p>;

  return (
    <div>
      <div className="container display-list-header d-flex flex-row justify-content-between align-items-center">
        <h2 className="page-header">
          Submissions for {data?.problemById?.leetcodeNumber}
          {'. '}
          {data?.problemById?.title}
        </h2>
      </div>
      <div className="main container container-list-part">
        <SubmissionList submissions={submissions} />
      </div>
    </div>
  );
};

export default ProblemSubmissionListPage;

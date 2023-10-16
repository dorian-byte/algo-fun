import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import SubmissionList, { Submission } from '../components/SubmissionList';

const ALL_SUBMISSIONS = gql`
  query AllSubmissions {
    allSubmissions {
      id
      problem {
        id
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

const SubmissionListPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { loading, error, data } = useQuery(ALL_SUBMISSIONS);

  useEffect(() => {
    if (data) {
      // console.log(data);
      setSubmissions(data.allSubmissions);
    }
  }, [data]);

  if (error) return <p>Error :( {error.message}</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5 overflow-y-auto">
      <h2 className="page-header">Submissions</h2>
      <SubmissionList submissions={submissions} showProblem={true} />
    </div>
  );
};

export default SubmissionListPage;

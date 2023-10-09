import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import SubmissionList, { Submission } from '../components/SubmissionList';

const ALL_SUBMISSIONS = gql`
  query AllSubmissions {
    allSubmissions {
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
      submittedAt
    }
  }
`;

const SubmissionListPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { loading, error, data } = useQuery(ALL_SUBMISSIONS);

  useEffect(() => {
    if (data) {
      console.log(data);
      setSubmissions(data.allSubmissions);
    }
  }, [data]);

  if (error) return <p>Error :( {error.message}</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-light">SubmissionListPage</h2>
      <SubmissionList submissions={submissions} />
    </div>
  );
};

export default SubmissionListPage;

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
      timeComplexity
      spaceComplexity
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
      console.log('*** data ***', data);
      setSubmissions(data.allSubmissions);
    }
  }, [data]);

  if (error) return <p>Error :( {error.message}</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="container display-list-header d-flex flex-row justify-content-between align-items-center">
        <h2 className="page-header">Submissions</h2>
      </div>
      <div className="main container container-list-part">
        <SubmissionList submissions={submissions} />
      </div>
    </div>
  );
};

export default SubmissionListPage;

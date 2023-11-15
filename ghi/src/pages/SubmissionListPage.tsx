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
      hasNotes
      notesCount
      hasResources
    }
  }
`;

const SubmissionListPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const { loading, error, data, refetch } = useQuery(ALL_SUBMISSIONS);

  useEffect(() => {
    if (data) setSubmissions(data.allSubmissions);
  }, [data]);

  useEffect(() => {
    refetch().then((res) => {
      console.log('refetching', res);
      if (res.data) setSubmissions(res.data.allSubmissions);
    });
  }, []);

  if (error) return <p>Error :( {error.message}</p>;
  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="page-header">Submissions</h2>
      </div>
      <div className="main container">
        <SubmissionList submissions={submissions} />
      </div>
    </div>
  );
};

export default SubmissionListPage;

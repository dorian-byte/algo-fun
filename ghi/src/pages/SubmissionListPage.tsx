import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import SubmissionList, { Submission } from '../components/SubmissionList';
import { useLocation } from 'react-router-dom';

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
  const { pathname } = useLocation();

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

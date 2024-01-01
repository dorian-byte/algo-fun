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
      <h2 className="page-header text-center mt-3 mb-4">All Submissions</h2>
      <SubmissionList submissions={submissions} />
    </div>
  );
};

export default SubmissionListPage;

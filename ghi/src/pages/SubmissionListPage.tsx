import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { InputBase } from '@mui/material';
import NewSubmissionPage from './NewSubmissionPage';

const ALL_SUBMISSIONS = gql`
  query AllSubmissions {
    allSubmissions {
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
      submittedAt
    }
  }
`;

const SubmissionListPage = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
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
    <div>
      <div>SubmissionListPage</div>
      {submissions.map((sm: any) => (
        <div key={sm?.id}>
          <div onClick={() => navigate(`/submissions/${sm?.id}`)}>{sm?.id}</div>
          <div>
            code:
            <div>
              <InputBase
                value={sm.code}
                maxRows={1000}
                multiline={true}
                sx={{
                  width: 1000,
                }}
              />
            </div>
          </div>
          <div
            style={{
              border: '1px solid',
              padding: 10,
              maxWidth: 1000,
              margin: 20,
              borderRadius: 20,
            }}
          >
            <div>is white board mode: {sm.isWhiteboardMode ? 'yes' : 'no'}</div>
            <div>is interview mode: {sm.isInterviewMode ? 'yes' : 'no'}</div>
            <div>duration: {sm.duration}</div>
            <div>proficiency level: {sm.proficiencyLevel}</div>
            <div>submitted at: {sm.submittedAt}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionListPage;

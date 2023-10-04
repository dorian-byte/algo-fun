import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { InputBase } from '@mui/material';

const ALL_SUBMISSIONS = gql`
  query AllSubmissions {
    allSubmissions {
      id
      code
      problem {
        id
        title
        description
        spaceComplexityRequirement
        timeComplexityRequirement
        difficulty
        createdAt
        updatedAt
      }
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
        <div key={sm.id}>
          <div onClick={() => navigate(`/submissions/${sm.id}`)}>{sm.id}</div>
          <div>
            code:
            <InputBase value={sm.code} disabled={false} maxRows={1000} />
          </div>
          <div>
            problem:
            {sm.problem.id} {sm.problem.title}
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
            <InputBase
              value={sm.problem.description}
              disabled={false}
              maxRows={1000}
              minRows={10}
              multiline={true}
              sx={{ width: 1000 }}
            />
          </div>
          <div>
            {sm.problem.spaceComplexityRequirement}{' '}
            {sm.problem.timeComplexityRequirement} {sm.problem.difficulty}{' '}
            {sm.problem.createdAt} {sm.problem.updatedAt}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionListPage;

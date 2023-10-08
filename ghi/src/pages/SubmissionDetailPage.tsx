import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { formatTime } from '../utils/timeFormat';
import CodeBlock from '../components/CodeBlock';

const SUMBISSION_BY_ID = gql`
  query SubmissionById($id: Int!) {
    submissionById(id: $id) {
      id
      problem {
        id
        title
      }
      code
      proficiencyLevel
      submittedAt
      duration
      isSolution
      isInterviewMode
      isWhiteboardMode
      methods {
        id
        name
      }
    }
  }
`;

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState({
    id: '',
    code: '',
    problem: { title: '' },
  }) as any;
  const { data } = useQuery(SUMBISSION_BY_ID, {
    variables: { id: id ? +id : 0 },
  });
  useEffect(() => {
    if (data) {
      setSubmission(data.submissionById);
    }
  }, [data]);

  return (
    <div className="container mt-5">
      <h2 className="mb-4">SubmissionListPage</h2>
      <div
        key={submission?.id}
        className="card bg-secondary text-light mb-4 p-3"
      >
        <h4 className="card-title">Submission ID: {submission?.id}</h4>
        <div className="card-text">
          <CodeBlock
            text={submission.code}
            language="python"
            showLineNumbers={true}
            theme="vs-dark"
          />
          <div className="mb-2">
            <strong>Is White Board Mode:</strong>{' '}
            {submission.isWhiteboardMode ? 'Yes' : 'No'}
          </div>
          <div className="mb-2">
            <strong>Is Interview Mode:</strong>{' '}
            {submission.isInterviewMode ? 'Yes' : 'No'}
          </div>
          <div className="mb-2">
            <strong>Duration:</strong> {submission.duration}
          </div>
          <div className="mb-2">
            <strong>Proficiency Level:</strong> {submission.proficiencyLevel}
          </div>
          <div className="mb-2">
            <strong>Submitted At:</strong> {formatTime(submission.submittedAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetailPage;

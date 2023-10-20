import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { formatTime } from '../utils/timeUtils';
import CodeEditor from '../components/CodeEditor';
import Drawer from '../components/DrawerWrapper';
import NoteForm from '../components/NoteForm';

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
      passed
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
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState({
    id: '',
    code: '',
    problem: { title: '' },
  }) as any;
  const { data } = useQuery(SUMBISSION_BY_ID, {
    variables: { id: submissionId ? +submissionId : 0 },
  });
  useEffect(() => {
    if (data) {
      setSubmission(data.submissionById);
    }
  }, [data]);

  return (
    <div className="container mt-5">
      <div className="card bg-secondary text-light mb-4 p-3">
        <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <Drawer buttonText="new note">
            <NoteForm inDrawer={true} />
          </Drawer>
        </div>
        <div className="card-text">
          <CodeEditor
            value={submission.code}
            language="python"
            showLineNumbers={true}
            theme="vs-dark"
            readOnly={true}
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
            <strong>Status:</strong> {submission.passed ? '✅' : '❌'}
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

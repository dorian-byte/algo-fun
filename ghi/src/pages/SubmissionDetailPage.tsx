import Drawer from '../components/DrawerWrapper';
import NoteForm from '../components/NoteForm';
import SubmissionForm from '../components/SubmissionForm';
import { useNavigate, useParams } from 'react-router-dom';

const SubmissionDetailPage = ({
  simplified,
  selectedSubmission,
  reloadSubmissions,
}: {
  simplified?: boolean;
  selectedSubmission?: any;
  reloadSubmissions?: () => void;
}) => {
  const navigate = useNavigate();
  const { submissionId } = useParams();

  if (simplified) {
    return (
      <SubmissionForm
        simplified={true}
        selectedSubmission={selectedSubmission}
        reloadSubmissions={reloadSubmissions}
      />
    );
  }
  return (
    <div>
      <div
        className="d-flex gap-3 justify-content-between align-items-center mt-5 mb-4"
        style={{ marginLeft: '142px', marginRight: '142px' }}
      >
        <h3 className="page-header">Submission Detail</h3>
        <div className="d-flex gap-3 justify-content-end align-items-center">
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate(`/submissions/${submissionId}/notes`);
            }}
          >
            Notes
          </button>
          <Drawer buttonText="Add Note">
            <div className="p-2 vh-100 p-5">
              <NoteForm />
            </div>
          </Drawer>
        </div>
      </div>
      <SubmissionForm />
    </div>
  );
};

export default SubmissionDetailPage;

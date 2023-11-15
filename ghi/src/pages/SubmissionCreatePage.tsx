import Drawer from '../components/DrawerWrapper';
import NoteForm from '../components/NoteForm';
import SubmissionForm from '../components/SubmissionForm';
import { useNavigate, useParams } from 'react-router-dom';

const SubmissionCreatePage = ({}: // simplified,
// selectedSubmission,
{
  // simplified?: boolean;
  // selectedSubmission?: any;
}) => {
  const navigate = useNavigate();
  const { submissionId } = useParams();

  // if (simplified) {
  //   return (
  //     <SubmissionForm
  //       simplified={true}
  //       selectedSubmission={selectedSubmission}
  //     />
  //   );
  // }
  return (
    <div>
      <div
        className="d-flex gap-3 justify-content-between align-items-center mt-5 mb-4"
        style={{ marginLeft: '142px', marginRight: '142px' }}
      >
        <h3 className="page-header">
          {submissionId ? 'Edit Submission' : 'New Submission'}
        </h3>
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
            <NoteForm />
          </Drawer>
        </div>
      </div>
      <SubmissionForm />
    </div>
  );
};

export default SubmissionCreatePage;

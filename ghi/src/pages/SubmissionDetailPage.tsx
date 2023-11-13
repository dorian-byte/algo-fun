import { Box } from '@mui/material';
import Drawer from '../components/DrawerWrapper';
import NoteForm from '../components/NoteForm';
import SubmissionForm from '../components/SubmissionForm';
import { useNavigate, useParams } from 'react-router-dom';

const SubmissionDetailPage = ({
  simplified,
  selectedSubmission,
}: {
  simplified?: boolean;
  selectedSubmission?: any;
}) => {
  const navigate = useNavigate();
  const { submissionId } = useParams();

  if (simplified) {
    return (
      <Box>
        <SubmissionForm
          simplified={true}
          selectedSubmission={selectedSubmission}
        />
      </Box>
    );
  }
  return (
    <div>
      <SubmissionForm />
      <button
        className="btn btn-outline-primary mb-2"
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
  );
};

export default SubmissionDetailPage;

import Drawer from '../components/DrawerWrapper';
import NoteForm from '../components/NoteForm';
import SubmissionForm from '../components/SubmissionForm';

const SubmissionDetailPage = ({
  simplified,
  selectedSubmission,
}: {
  simplified?: boolean;
  selectedSubmission?: any;
}) => {
  if (simplified) {
    return (
      <SubmissionForm
        simplified={true}
        selectedSubmission={selectedSubmission}
      />
    );
  }
  return (
    <div>
      <SubmissionForm />
      <Drawer>
        <NoteForm />
      </Drawer>
    </div>
  );
};

export default SubmissionDetailPage;

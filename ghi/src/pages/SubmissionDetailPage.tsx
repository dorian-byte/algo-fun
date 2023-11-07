import Drawer from '../components/DrawerWrapper';
import NoteForm from '../components/NoteForm';
import SubmissionForm from '../components/SubmissionForm';

const SubmissionDetailPage = () => {
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

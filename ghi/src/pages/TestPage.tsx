import TemporaryDrawer from '../components/DrawerWrapper';
import NoteForm from '../components/NoteForm';

const TestPage = () => {
  return (
    <div>
      <h1 className="page-header">Test Page</h1>
      <TemporaryDrawer>
        <NoteForm />
      </TemporaryDrawer>
    </div>
  );
};

export default TestPage;

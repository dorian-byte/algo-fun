import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import Nav from './components/Nav';
import ProblemSearchPage from './pages/ProblemSearchPage';
import ProblemListPage from './pages/ProblemListPage';
import ProblemHubPage from './pages/ProblemHubPage';
import ProblemCreatePage from './pages/ProblemCreatePage';
import SubmissionListPage from './pages/SubmissionListPage';
import SubmissionDetailPage from './pages/SubmissionDetailPage';
import SubmissionCreatePage from './pages/SubmissionCreatePage';
import NoteListPage from './pages/NoteListPage';
import NoteCreatePage from './pages/NoteCreatePage';
import ProblemSubmissionListPage from './pages/ProblemSubmissionListPage';
import ProblemNoteListPage from './pages/ProblemNoteListPage';
import SubmissionNoteListPage from './pages/SubmissionNoteListPage';
import NotFoundPage from './pages/NotFoundPage';
{
  /* FIXME: only for testing. Delete later. */
}
import ResourceList from './components/ResourceList';
import ResourceForm from './components/ResourceForm';
import ResourceDetail from './components/ResourceDetail';
import ResourceEditForm from './components/ResourceEditForm';

import TestPage from './pages/TestPage';

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Nav />
        <div style={{ height: 60 }}></div>
        <Routes>
          <Route path="/" element={<ProblemSearchPage />} />
          {/* FIXME: only for testing. Delete later. */}
          <Route path="/resources">
            <Route path="" element={<ResourceList />} />
            <Route path="new" element={<ResourceForm />} />
            <Route path=":resourceId">
              <Route path="" element={<ResourceDetail />} />
              <Route path="edit" element={<ResourceEditForm />} />
            </Route>
          </Route>
          <Route path="/notes">
            <Route path="" element={<NoteListPage />} />
            <Route path="new" element={<NoteCreatePage />} />
          </Route>
          <Route path="/submissions">
            <Route path="" element={<SubmissionListPage />} />
            <Route path="new" element={<SubmissionCreatePage />} />
            <Route path=":submissionId">
              <Route path="" element={<SubmissionDetailPage />} />
              <Route path="edit" element={<SubmissionCreatePage />} />
              <Route path="notes">
                <Route path="" element={<SubmissionNoteListPage />} />
                {/* same page as above but passing in problemId */}
                <Route path="new" element={<NoteCreatePage />} />
              </Route>
            </Route>
          </Route>
          <Route path="/problems">
            <Route path="" element={<ProblemListPage />} />
            <Route path="new" element={<ProblemCreatePage />} />
            <Route path=":problemId">
              <Route path="" element={<ProblemHubPage />} />
              <Route path="notes">
                <Route path="" element={<ProblemNoteListPage />} />
                {/* same page as above but passing in problemId */}
                <Route path="new" element={<NoteCreatePage />} />
              </Route>
              <Route path="submissions">
                <Route path="" element={<ProblemSubmissionListPage />} />
                {/* same page as above but passing in problemId */}
                <Route path="new" element={<SubmissionCreatePage />} />
              </Route>
            </Route>
          </Route>
          <Route path="test" element={<TestPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;

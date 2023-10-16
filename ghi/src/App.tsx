import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import Nav from './components/Nav';
import ProblemSearchPage from './pages/ProblemSearchPage';
import ProblemListPage from './pages/ProblemListPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import ProblemCreatePage from './pages/ProblemCreatePage';
import ProblemEditPage from './pages/ProblemEditPage';
import SubmissionListPage from './pages/SubmissionListPage';
import SubmissionDetailPage from './pages/SubmissionDetailPage';
import SubmissionCreatePage from './pages/SubmissionCreatePage';
import SubmissionEditPage from './pages/SubmissionEditPage';
import ProblemSubmissionListPage from './pages/ProblemSubmissionListPage';
import ProblemNoteListPage from './pages/ProblemNoteListPage';
import ProblemNoteDetailPage from './pages/ProblemNoteDetailPage';
import ProblemNoteCreatePage from './pages/ProblemNoteCreatePage';
import ProblemNoteEditPage from './pages/ProblemNoteEditPage';
import SubmissionNoteListPage from './pages/SubmissionNoteListPage';
import SubmissionNoteDetailPage from './pages/SubmissionNoteDetailPage';
import SubmissionNoteCreatePage from './pages/SubmissionNoteCreatePage';
import SubmissionNoteEditPage from './pages/SubmissionNoteEditPage';
import NotFoundPage from './pages/NotFoundPage';

import ResourceList from './components/ResourceList';
import ResourceForm from './components/ResourceForm';
import ResourceDetail from './components/ResourceDetail';
import ResourceEditForm from './components/ResourceEditForm';
import ProblemResourceList from './components/ProblemResourceList';

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
          <Route path="/submissions">
            <Route path="" element={<SubmissionListPage />} />
            <Route path="new" element={<SubmissionCreatePage />} />
            <Route path=":submissionId">
              <Route path="" element={<SubmissionDetailPage />} />
              <Route path="edit" element={<SubmissionEditPage />} />
              <Route path="notes">
                <Route path="" element={<SubmissionNoteListPage />} />
                <Route path="new" element={<SubmissionNoteCreatePage />} />
                <Route path=":noteId">
                  <Route path="" element={<SubmissionNoteDetailPage />} />
                  <Route path="edit" element={<SubmissionNoteEditPage />} />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="/problems">
            <Route path="" element={<ProblemListPage />} />
            <Route path="new" element={<ProblemCreatePage />} />
            <Route path=":problemId">
              <Route path="" element={<ProblemDetailPage />} />
              <Route path="edit" element={<ProblemEditPage />} />
              <Route path="notes">
                <Route path="" element={<ProblemNoteListPage />} />
                <Route path="new" element={<ProblemNoteCreatePage />} />
                <Route path=":noteId">
                  <Route path="" element={<ProblemNoteDetailPage />} />
                  <Route path="edit" element={<ProblemNoteEditPage />} />
                </Route>
              </Route>
              <Route path="submissions">
                <Route path="" element={<ProblemSubmissionListPage />} />
                {/* same page as above but passing in problemId */}
                <Route path="new" element={<SubmissionCreatePage />} />
              </Route>
              {/* FIXME: only for testing. Delete later. */}
              <Route path="resources" element={<ProblemResourceList />} />
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

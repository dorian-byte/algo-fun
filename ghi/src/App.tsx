import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import Nav from './components/Nav';
import LandingPage from './pages/LandingPage';
import NewSubmissionPage from './pages/NewSubmissionPage';
import NotFoundPage from './pages/NotFoundPage';
import ProblemListPage from './pages/ProblemListPage';
import ProblemDetailPage from './pages/ProblemDetailPage';
import SubmissionListPage from './pages/SubmissionListPage';
import SubmissionDetailPage from './pages/SubmissionDetailPage';

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/submissions">
            <Route path="" element={<SubmissionListPage />} />
            <Route path="new" element={<NewSubmissionPage />} />
            <Route path=":id" element={<SubmissionDetailPage />} />
          </Route>
          <Route path="/problems">
            <Route path="" element={<ProblemListPage />} />
            <Route path=":id" element={<ProblemDetailPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;

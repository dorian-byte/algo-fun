import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { dtStrToLocalShortStr } from '../utils/timeUtils';
import CodeEditor from '../components/CodeEditor';
import Drawer from '../components/DrawerWrapper';
import NoteForm from '../components/NoteForm';
import SubmissionForm from '../components/SubmissionForm';

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
      timeComplexity
      spaceComplexity
      methods {
        id
        name
      }
    }
  }
`;

const SubmissionDetailPage = () => {
  const { submissionId } = useParams();
  const [readonly, setReadonly] = useState(true);
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
  return <SubmissionForm />;
};

export default SubmissionDetailPage;

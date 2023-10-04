import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
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
      submittedAt
      duration
      isSolution
      isInterviewMode
      isWhiteboardMode
      methods {
        id
        name
      }
    }
  }
`;
const SubmissionDetailPage = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState({
    id: '',
    code: '',
    problem: { title: '' },
  }) as any;
  const { data } = useQuery(SUMBISSION_BY_ID, {
    variables: { id: id ? +id : 0 },
  });
  useEffect(() => {
    if (data) {
      setSubmission(data.submissionById);
    }
  }, [data]);

  return (
    <div>
      id: {submission?.id} code: {submission?.code} problem:{' '}
      {submission?.problem?.title}
    </div>
  );
};

export default SubmissionDetailPage;

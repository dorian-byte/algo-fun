import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import SubmissionForm from '../components/SubmissionForm';

const CREATE_SUBMISSION = gql`
  mutation CreateSubmission($input: SubmissionMutationInput!) {
    updateSubmission(input: $input) {
      submission {
        id
        code
        duration
        isSolution
        isWhiteboardMode
        isInterviewMode
        methods {
          name
        }
        proficiencyLevel
        submittedAt
      }
    }
  }
`;
const SubmissionCreatePage = () => {
  const [data, setData] = useState<any>(null);
  const [createSubmission] = useMutation(CREATE_SUBMISSION, {
    variables: {
      input: {
        ...data,
        duration: +data?.duration,
        methods: data?.methods?.split(','),
      },
    },
  });
  const handleSubmit = (e: any) => {
    e.preventDefault();
    createSubmission().then(() => {
      // console.log('data', data);
    });
  };

  return (
    <div>
      <SubmissionForm
        data={data}
        setData={setData}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default SubmissionCreatePage;

import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
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
const NewSubmissionPage = () => {
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
    createSubmission().then((res) => {
      console.log(res);
      console.log('data', data);
    });
  };

  return (
    <div>
      <div>NewSubmissionPage</div>
      <div>
        <label>
          code
          <input
            type="text"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, code: e.target.value }))
            }
          />
        </label>
        <label htmlFor="problem">
          problem
          <input
            type="number"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, problem: e.target.value }))
            }
          />
        </label>
      </div>
      <div>
        <label htmlFor="proficiencyLevel">
          proficiencyLevel
          <input
            type="text"
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                proficiencyLevel: e.target.value,
              }))
            }
          />
        </label>
      </div>
      <div>
        <label htmlFor="submittedAt">
          submittedAt
          <input
            type="text"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, submittedAt: e.target.value }))
            }
          />
        </label>
      </div>
      <div>
        <label htmlFor="duration">
          duration
          <input
            type="number"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, duration: e.target.value }))
            }
          />
        </label>
      </div>
      <div>
        <label htmlFor="isSolution">
          isSolution
          <input
            type="checkbox"
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                isSolution: e.target.value == 'on' ? true : false,
              }))
            }
          />
        </label>
      </div>
      <div>
        <label htmlFor="isWhiteboardMode">
          isWhiteboardMode
          <input
            type="checkbox"
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                isWhiteboardMode: e.target.value == 'on' ? true : false,
              }))
            }
          />
        </label>
      </div>
      <div>
        <label htmlFor="isInterviewMode">
          isInterviewMode
          <input
            type="checkbox"
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                isInterviewMode: e.target.value == 'on' ? true : false,
              }))
            }
          />
        </label>
      </div>
      <div>
        <label htmlFor="methods">
          methods
          <input
            type="text"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, methods: e.target.value }))
            }
          />
        </label>
      </div>
      <button onClick={handleSubmit}>try</button>
    </div>
  );
};

export default NewSubmissionPage;

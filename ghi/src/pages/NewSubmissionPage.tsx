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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '2rem',
        fontFamily: 'Arial, sans-serif',
        background: '#f4f4f7',
        minHeight: '100vh',
      }}
    >
      <h2 style={{ marginBottom: '2rem' }}>New Submission Page</h2>
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxWidth: '400px',
          width: '100%',
          background: '#ffffff',
          padding: '2rem',
          borderRadius: '8px',
          boxShadow: '0 0 15px rgba(0,0,0,0.1)',
        }}
      >
        <label>
          Code
          <input
            style={inputStyle}
            type="text"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, code: e.target.value }))
            }
          />
        </label>
        <label>
          Problem
          <input
            style={inputStyle}
            type="number"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, problem: e.target.value }))
            }
          />
        </label>
        <label>
          Proficiency Level
          <input
            style={inputStyle}
            type="text"
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                proficiencyLevel: e.target.value,
              }))
            }
          />
        </label>
        <label>
          Submitted At
          <input
            style={inputStyle}
            type="text"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, submittedAt: e.target.value }))
            }
          />
        </label>
        <label>
          Duration
          <input
            style={inputStyle}
            type="number"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, duration: e.target.value }))
            }
          />
        </label>
        <label>
          Is Solution
          <input
            style={checkboxStyle}
            type="checkbox"
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                isSolution: e.target.value == 'on' ? true : false,
              }))
            }
          />
        </label>
        <label>
          Is Whiteboard Mode
          <input
            style={checkboxStyle}
            type="checkbox"
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                isWhiteboardMode: e.target.value == 'on' ? true : false,
              }))
            }
          />
        </label>
        <label>
          Is Interview Mode
          <input
            style={checkboxStyle}
            type="checkbox"
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                isInterviewMode: e.target.value == 'on' ? true : false,
              }))
            }
          />
        </label>
        <label>
          Methods
          <input
            style={inputStyle}
            type="text"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, methods: e.target.value }))
            }
          />
        </label>
        <button style={buttonStyle} onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

const inputStyle = {
  padding: '0.5rem',
  fontSize: '1rem',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginTop: '0.5rem',
};

const checkboxStyle = {
  marginLeft: '0.5rem',
};

const buttonStyle = {
  padding: '0.75rem 1.5rem',
  fontSize: '1rem',
  borderRadius: '4px',
  border: 'none',
  cursor: 'pointer',
  background: '#007BFF',
  color: '#ffffff',
  transition: 'background 0.3s ease',
  alignSelf: 'center',
};

export default NewSubmissionPage;

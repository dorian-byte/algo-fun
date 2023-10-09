import './SubmissionForm.css';

interface Props {
  data: any;
  setData: (data: any) => void;
  handleSubmit: (e: any) => void;
}

const SubmissionForm: React.FC<Props> = ({ data, setData, handleSubmit }) => {
  return (
    <div className="submission-container">
      <h1>New Submission</h1>
      <form className="submission-form">
        <label>
          Code
          <input
            type="text"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, code: e.target.value }))
            }
          />
        </label>
        <label>
          Problem
          <input
            type="number"
            value={data?.problem?.id}
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, problem: e.target.value }))
            }
          />
        </label>
        <label>
          Proficiency Level
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
        <label>
          Submitted At
          <input
            type="text"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, submittedAt: e.target.value }))
            }
          />
        </label>
        <label>
          Duration
          <input
            type="number"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, duration: e.target.value }))
            }
          />
        </label>
        <label>
          Is Solution
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
        <label>
          Is Whiteboard Mode
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
        <label>
          Is Interview Mode
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
        <label>
          Methods
          <input
            type="text"
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, methods: e.target.value }))
            }
          />
        </label>
        <button className="submit-button" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmissionForm;

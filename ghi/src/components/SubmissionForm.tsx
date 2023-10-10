import './SubmissionForm.css';
import { toLocalTime } from '../utils/timeUtils';

export const ProficiencyLevel = {
  NO_UNDERSTANDING: ['no_understanding', 'no understanding'],
  CONCEPTUAL_UNDERSTANDING: [
    'conceptual_understanding',
    'conceptual understanding',
  ],
  NO_PASS: ['no_pass', 'no pass'],
  GUIDED_PASS: ['guided_pass', 'guided pass'],
  UNSTEADY_PASS: ['unsteady_pass', 'unsteady pass'],
  SMOOTH_PASS: ['smooth_pass', 'smooth pass'],
  SMOOTH_OPTIMAL_PASS: ['smooth_optimal_pass', 'smooth optimal pass'],
};

interface Props {
  data: any;
  setData: (data: any) => void;
  handleSubmit: (e: any) => void;
  problemDetails: {
    leetcodeNumber: number;
    title: string;
  };
  showFixedProblemTitleInSelection?: boolean;
  allProblems?: any[];
}

const SubmissionForm: React.FC<Props> = ({
  data,
  setData,
  handleSubmit,
  problemDetails,
  showFixedProblemTitleInSelection,
  allProblems,
}) => {
  const handleDateTimeChange = (type: 'date' | 'time', value: string) => {
    const [currentDate, currentTime] = data?.submittedAt?.split('T');
    const newDateTime =
      type === 'date' ? `${value}T${currentTime}` : `${currentDate}T${value}`;
    setData((prev: any) => ({ ...prev, submittedAt: newDateTime }));
  };
  console.log('data', data);
  console.log('problemDetails', problemDetails);
  console.log('all problems', allProblems);
  console.log(
    'showFixedProblemTitleInSelection',
    showFixedProblemTitleInSelection
  );

  return (
    <div className="container mt-5">
      {problemDetails?.title && (
        <h1 className="mb-4">
          New Submission for {problemDetails?.leetcodeNumber}.{' '}
          {problemDetails?.title}
        </h1>
      )}
      <form className="submission-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group col-md-12">
            <label>Code</label>
            <textarea
              className="form-control"
              rows={10}
              value={data?.code}
              onChange={(e) =>
                setData((prev: any) => ({ ...prev, code: e.target.value }))
              }
            />
          </div>
          {showFixedProblemTitleInSelection ? (
            <div className="form-group col-md-12">
              <label>Problem Full Name</label>
              <input
                className="form-control"
                type="text"
                value={`${problemDetails?.leetcodeNumber} - ${problemDetails?.title}`}
                disabled
              />
            </div>
          ) : (
            <div className="form-group col-md-12">
              <label>Select Problem</label>
              <select
                className="form-control"
                value={data?.problem || 0}
                onChange={(e) =>
                  setData((prev: any) => ({ ...prev, problem: e.target.value }))
                }
              >
                {/* this "Select a problem..." is the default option but is non-selectable, 
                meaning once a user made a choice they can't go back to this default option. */}
                <option value={0} disabled>
                  Select a problem...
                </option>

                {allProblems?.map((problem) => (
                  <option key={problem?.id} value={problem?.id}>
                    {problem?.leetcodeNumber}. {problem?.title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Proficiency Level</label>
          <select
            className="form-control"
            value={data?.proficiencyLevel}
            onChange={(e) => {
              setData((prev: any) => ({
                ...prev,
                proficiencyLevel: e.target.value,
              }));
            }}
          >
            {Object.values(ProficiencyLevel).map((level) => (
              <option key={level[0]} value={level[0]}>
                {level[1]}
              </option>
            ))}
          </select>
        </div>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="isSolutionSwitch"
            checked={data?.isSolution}
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                isSolution: e.target.checked,
              }))
            }
          />
          <label className="form-check-label" htmlFor="isSolutionSwitch">
            Best Solution
          </label>
        </div>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="isWhiteboardModeSwitch"
            checked={data?.isWhiteboardMode}
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                isWhiteboardMode: e.target.checked,
              }))
            }
          />
          <label className="form-check-label" htmlFor="isWhiteboardModeSwitch">
            Whiteboard Mode
          </label>
        </div>

        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="isInterviewModeSwitch"
            checked={data?.isInterviewMode}
            onChange={(e) =>
              setData((prev: any) => ({
                ...prev,
                isInterviewMode: e.target.checked,
              }))
            }
          />
          <label className="form-check-label" htmlFor="isInterviewModeSwitch">
            Interview Mode
          </label>
        </div>

        <div className="form-row">
          <div className="form-group col-md-6">
            <label>Submitted At</label>
            <input
              className="form-control"
              type="date"
              value={data?.submittedAt.split('T')[0]}
              onChange={(e) => handleDateTimeChange('date', e.target.value)}
            />
            <input
              className="form-control"
              type="time"
              value={data?.submittedAt.split('T')[1]}
              onChange={(e) => handleDateTimeChange('time', e.target.value)}
            />
          </div>
          <div className="form-group col-md-6">
            <label>Duration</label>
            <input
              className="form-control"
              type="number"
              value={data?.duration}
              onChange={(e) =>
                setData((prev: any) => ({ ...prev, duration: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="form-group">
          <label>Methods</label>
          <select
            multiple
            className="form-control"
            value={data?.methods}
            onChange={(e) => {
              const selectedOptions = Array.from(
                e.target.selectedOptions,
                (option) => option.value
              );
              setData((prev: any) => ({ ...prev, methods: selectedOptions }));
            }}
          >
            {/* TODO: Fetch these method names dynamically from the backend */}
            {['method1', 'method2', 'method3'].map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default SubmissionForm;

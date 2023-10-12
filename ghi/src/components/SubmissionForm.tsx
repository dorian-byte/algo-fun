import { useCallback, useEffect, useRef, useState } from 'react';
import CodeEditor from './CodeEditor';
import './SubmissionForm.css';
import { Typeahead } from 'react-bootstrap-typeahead';

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
    id: string;
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
  // console.log('data', data);
  // console.log('problemDetails', problemDetails);
  // console.log('all problems', allProblems);
  // console.log(
  //   'showFixedProblemTitleInSelection',
  //   showFixedProblemTitleInSelection
  // );
  // useEffect(() => {
  //   console.log('data changed', data);
  // }, [data]);

  const [codeBlockHeight, setCodeBlockHeight] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<any[]>([
    allProblems && allProblems.length > 0
      ? { id: '', leetcodeNumber: '', title: '' }
      : problemDetails,
  ]);
  const [options, setOptions] = useState<any[]>(
    allProblems && allProblems.length > 0 ? allProblems : [problemDetails]
  );
  useEffect(() => {
    if (parentRef?.current?.clientHeight) {
      console.log('parentRef height', parentRef?.current?.clientHeight);
      setCodeBlockHeight(parentRef?.current?.clientHeight);
    }
  }, [parentRef]);
  const handleSelectionChange = useCallback((selectedProblem: any) => {
    const selectedId = selectedProblem[0] ? selectedProblem[0].id : null;
    setData((prev: any) => ({
      ...prev,
      problem: selectedId,
    }));
    setSelected(selectedProblem || []); // Ensures 'selected' is always an array
  }, []);
  useEffect(() => {
    if (allProblems && Array.isArray(allProblems)) {
      setOptions(allProblems);
    }
    if (problemDetails && typeof problemDetails === 'object') {
      setSelected([problemDetails]);
    }
  }, [allProblems, problemDetails]);

  return (
    <div className="container mt-5" ref={parentRef}>
      <form className="d-flex flex-row gap-5" onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-2 flex-fill">
          <h3 className="headline mb-2">New Submission</h3>
          <div className="form-group col-md-12 mb-2">
            <label className="mb-2">
              {showFixedProblemTitleInSelection ? 'Problem' : 'Select Problem'}
            </label>
            <Typeahead
              className="form-control"
              id="select-problem"
              labelKey={(option: any) =>
                `${option?.leetcodeNumber} ${option?.title}`
              }
              selected={selected}
              options={options}
              disabled={showFixedProblemTitleInSelection}
              renderInput={(props) => {
                return (
                  <input
                    id="select-problem-in-new-submission"
                    {...props}
                    style={{
                      backgroundColor: 'transparent !important',
                    }}
                  />
                );
              }}
              placeholder="Choose a LeetCode problem..."
              onChange={handleSelectionChange}
              renderMenuItemChildren={(option: any) => (
                <div>
                  {option?.leetcodeNumber} - {option?.title}
                </div>
              )}
            />
          </div>
          <div className="form-group mb-2">
            <label className="mb-2">Proficiency Level</label>
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
            <label
              className="form-check-label"
              htmlFor="isWhiteboardModeSwitch"
            >
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

          <div className="form-row mt-2 mb-2">
            <div className="form-group col-md-6">
              <label className="mb-2">Submitted At</label>
              <input
                className="form-control mb-2"
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
            <div className="form-group col-md-6 mt-3">
              <label className="mb-2">Duration</label>
              <input
                className="form-control"
                type="number"
                value={data?.duration}
                onChange={(e) =>
                  setData((prev: any) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label className="mb-2">Methods</label>
            <select
              multiple
              className="form-control"
              value={data?.methods}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setData((prev: any) => ({
                  ...prev,
                  methods: selectedOptions,
                }));
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
        </div>

        <CodeEditor
          width="50%"
          height={codeBlockHeight + 'px'}
          placeholder="Enter your code here..."
          language="python"
          value={data?.code}
          showLineNumbers={true}
          theme="vs-dark"
          readOnly={false}
          onChange={(value: string) => {
            setData((prev: any) => ({ ...prev, code: value }));
          }}
        />
      </form>
    </div>
  );
};

export default SubmissionForm;

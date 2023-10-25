import { useCallback, useEffect, useRef, useState } from 'react';
import CodeEditor from './CodeEditor';
import { Typeahead } from 'react-bootstrap-typeahead';

export const PROFICIENCY_LEVEL = {
  no_understanding: 'No Understanding',
  conceptual_understanding: 'Conceptual Understanding',
  no_pass: 'No Pass',
  guided_pass: 'Guided Pass',
  unsteady_pass: 'Unsteady Pass',
  smooth_pass: 'Smooth Pass',
  smooth_optimal_pass: 'Smooth Optimal Pass',
} as { [key: string]: string };

// class Complexity(models.TextChoices):
//     O_1 = "o1", "o1"
//     O_N_SQUARE_ROOT = "nsqrt", "nsqrt"
//     O_LOGN = "logn", "logn"
//     O_N = "n", "n"
//     O_NLOGN = "nlogn", "nlogn"
//     O_N2 = "n2", "n2"
//     O_N3 = "n3", "n3"
//     O_2N = "2n", "2n"
//     O_N_FACTORIAL = "nfactorial", "nfactorial"

export const BIG_O_COMPLEXITY = {
  o1: 'O(1)',
  nsqrt: 'O(N^1/2)',
  logn: 'O(logN)',
  n: 'O(N)',
  nlogn: 'O(NlogN)',
  n2: 'O(N^2)',
  n3: 'O(N^3)',
  '2n': 'O(2^N)',
  nfactorial: 'O(N!)',
} as { [key: string]: string };

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

  // useEffect(() => {
  //   console.log('data', data);
  // }, [data]);

  return (
    <div className="container mt-5 overflow-y-auto" ref={parentRef}>
      <form className="d-flex flex-row gap-5" onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-2 flex-fill">
          <h3 className="page-header">New Submission</h3>
          <div className="form-group mt-3">
            <label className="mb-2">
              {showFixedProblemTitleInSelection ? 'Problem' : 'Select Problem'}
              {!showFixedProblemTitleInSelection && (
                <span className="required-asterisk"> *</span>
              )}
            </label>
            <Typeahead
              className="form-control"
              id="select-problem-typeahead"
              labelKey={(option: any) =>
                `${option?.leetcodeNumber} ${option?.title}`
              }
              selected={selected}
              options={options}
              disabled={showFixedProblemTitleInSelection}
              renderInput={(props) => {
                return (
                  <input
                    id="select-problem-inside-typeahead"
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

          <div className="form-group mt-3">
            <label className="mb-2">Proficiency Level</label>
            <span className="required-asterisk"> *</span>
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
              <option value="" disabled>
                Please Select
              </option>
              {Object.keys(PROFICIENCY_LEVEL).map((level) => (
                <option key={level} value={level}>
                  {PROFICIENCY_LEVEL[level] as string}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex flex-row gap-3 mt-3">
            <div className="form-group">
              <label className="mb-2">O-Time</label>
              <span className="required-asterisk"> *</span>
              <select
                className="form-control"
                value={data?.timeComplexity}
                onChange={(e) => {
                  setData((prev: any) => ({
                    ...prev,
                    timeComplexity: e.target.value,
                  }));
                }}
              >
                <option value="" disabled>
                  Select
                </option>
                {Object.keys(BIG_O_COMPLEXITY).map((level) => (
                  <option key={level} value={level}>
                    {BIG_O_COMPLEXITY[level] as string}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="mb-2">O-Space</label>
              {/* <span className="required-asterisk"> *</span> */}
              <select
                className="form-control"
                value={data?.spaceComplexity}
                onChange={(e) => {
                  setData((prev: any) => ({
                    ...prev,
                    spaceComplexity: e.target.value,
                  }));
                }}
              >
                <option value="" disabled>
                  Select
                </option>
                {Object.keys(BIG_O_COMPLEXITY).map((level) => (
                  <option key={level} value={level}>
                    {BIG_O_COMPLEXITY[level] as string}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-flex flex-column gap-1 mt-4 mb-1">
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
              <label
                className="form-check-label"
                htmlFor="isInterviewModeSwitch"
              >
                Interview Mode
              </label>
            </div>
          </div>

          <div className="d-flex flex-row mt-3">
            <div className="form-group">
              <label className="mb-2">Submitted At</label>
              <div className="d-flex flex-row">
                <input
                  className="form-control"
                  type="date"
                  value={data?.submittedAt.split('T')[0]}
                  onChange={(e) => handleDateTimeChange('date', e.target.value)}
                />
                <input
                  className="form-control ms-2"
                  type="time"
                  value={data?.submittedAt.split('T')[1]}
                  onChange={(e) => handleDateTimeChange('time', e.target.value)}
                />
              </div>
            </div>
            <div className="form-group ms-5">
              <label className="mb-2">Time Used (mins)</label>
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
                min="0"
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  if (Number(input.value) < 0) input.value = '0';
                }}
              />
            </div>
          </div>

          <div className="form-group mt-3">
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

          <button type="submit" className="btn btn-outline-primary mt-4 mb-5">
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

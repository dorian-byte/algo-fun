import { useCallback, useEffect, useRef, useState } from 'react';
import CodeEditor from './CodeEditor';
import { Typeahead } from 'react-bootstrap-typeahead';
import Timer from '../components/Timer.tsx';
import { PROFICIENCY_LEVEL_DISPLAY } from './SubmissionList';
import { BIG_O_COMPLEXITY_DISPLAY } from './SubmissionList';
import ChatMethodGenerator from './ChatMethodGenerator.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey } from '@fortawesome/free-solid-svg-icons';

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

const BestSolutionKey = ({
  isSolution,
  setIsSolution,
}: {
  isSolution: boolean;
  setIsSolution: () => void;
}) => {
  return (
    <FontAwesomeIcon
      icon={faKey}
      style={{
        color: isSolution ? 'darkorange' : 'grey',
        fontSize: '24px',
        cursor: 'pointer',
      }}
      onClick={setIsSolution}
    />
  );
};

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
  useEffect(() => {
    console.log('data changed', data);
  }, [data]);

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
          <div className="d-flex flex-row align-items-baseline justify-content-start gap-3">
            <h3 className="page-header">New Submission</h3>
            <BestSolutionKey
              isSolution={data?.isSolution}
              setIsSolution={() => {
                setData((prev: any) => ({
                  ...prev,
                  isSolution: !prev.isSolution,
                }));
              }}
            />
          </div>
          <div className="form-floating mt-3">
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
              // placeholder="Select"
              onChange={handleSelectionChange}
              renderMenuItemChildren={(option: any) => (
                <div>
                  {option?.leetcodeNumber} - {option?.title}
                </div>
              )}
            />
            <label>
              {/* {showFixedProblemTitleInSelection ? 'Problem' : 'Select Problem'} */}
              Problem
              {!showFixedProblemTitleInSelection && (
                <span className="required-asterisk"> *</span>
              )}
            </label>
          </div>

          <div className="d-flex flex-row justify-content-between gap-4 mt-4">
            <div className="form-floating flex-fill">
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
                <option value="" disabled></option>
                {Object.keys(PROFICIENCY_LEVEL_DISPLAY).map((level) => (
                  <option key={level} value={level.toLowerCase()}>
                    {PROFICIENCY_LEVEL_DISPLAY[level]}
                  </option>
                ))}
              </select>
              <label>
                Proficiency Level
                <span className="required-asterisk"> *</span>
              </label>
            </div>

            <div className="d-flex flex-row gap-2">
              <div className="form-floating">
                <select
                  id="o-time"
                  // className="form-select"
                  className="form-control"
                  value={data?.timeComplexity}
                  onChange={(e) => {
                    setData((prev: any) => ({
                      ...prev,
                      timeComplexity: e.target.value,
                    }));
                  }}
                >
                  <option value="" selected>
                    {/* <option value="" disabled> */}
                  </option>
                  {Object.keys(BIG_O_COMPLEXITY_DISPLAY).map((level) => (
                    <option
                      key={level}
                      value={level.toLowerCase()}
                      dangerouslySetInnerHTML={{
                        __html: BIG_O_COMPLEXITY_DISPLAY[level] as string,
                      }}
                    ></option>
                  ))}
                </select>
                <label htmlFor="o-time">
                  Time <span className="required-asterisk"> *</span>
                </label>
              </div>

              <div className="form-floating">
                <select
                  id="o-space"
                  // className="form-select"
                  className="form-control"
                  value={data?.spaceComplexity}
                  onChange={(e) => {
                    setData((prev: any) => ({
                      ...prev,
                      spaceComplexity: e.target.value,
                    }));
                  }}
                >
                  <option value="" selected>
                    {/* <option value="" disabled> */}
                  </option>
                  {Object.keys(BIG_O_COMPLEXITY_DISPLAY).map((level) => (
                    <option
                      key={level}
                      value={level.toLowerCase()}
                      dangerouslySetInnerHTML={{
                        __html: BIG_O_COMPLEXITY_DISPLAY[level] as string,
                      }}
                    >
                      {/* {BIG_O_COMPLEXITY_DISPLAY[level]} */}
                    </option>
                  ))}
                </select>
                <label htmlFor="o-space">
                  Space
                  {/* <span className="required-asterisk"> *</span> */}
                </label>
              </div>
            </div>
          </div>

          <div className="d-flex flex-row mt-3 justify-content-between">
            <div className="form-group flex-fill">
              <label className="text-gray small mb-1">Submitted At</label>
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
              <label className="text-gray small mb-1">Mins Used</label>
              <input
                className="form-control"
                type="number"
                value={data?.duration}
                placeholder="Mins Used"
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

          <div className="d-flex mt-3">
            <div className="w-50">
              <ChatMethodGenerator data={data} setData={setData} />
            </div>
            {/* <div className="form-group" style={{ width: '40%' }}>
              <label className="text-gray small mb-1">Methods</label>
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
                {['method1', 'method2', 'method3'].map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div> */}

            <div className="d-flex flex-column gap-1 mt-2">
              {/* <div className="form-check form-switch">
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
              </div> */}
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
          </div>

          <button type="submit" className="btn btn-outline-primary mt-1">
            Submit
          </button>
        </div>

        <div className="d-flex flex-column flex-fill">
          <div className="d-flex flex-row justify-content-between align-items-baseline">
            <label className="text-gray">Code</label>
            <Timer />
          </div>
          <CodeEditor
            width="100%"
            height={`${codeBlockHeight - 100}px`}
            language={data?.isWhiteboardMode ? 'plaintext' : 'python'}
            value={data?.code}
            showLineNumbers={true}
            theme="vs-dark"
            readOnly={false}
            onChange={(value: string) => {
              setData((prev: any) => ({ ...prev, code: value }));
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;

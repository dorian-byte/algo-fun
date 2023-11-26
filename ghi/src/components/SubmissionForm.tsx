import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import {
  FETCH_PROBLEM,
  FETCH_ALL_PROBLEMS,
  FETCH_SUBMISSION,
  CREATE_SUBMISSION,
  DELETE_SUBMISSION,
} from '../graphql/submissionQueries';
import { dtToLocalISO16 } from '../utils/timeUtils';
import CodeEditor from './CodeEditor';
import { Typeahead } from 'react-bootstrap-typeahead';
import Timer from '../components/Timer.tsx';
import { PROFICIENCY_LEVEL_DISPLAY } from './SubmissionList';
import { BIG_O_COMPLEXITY_DISPLAY } from './SubmissionList';
import ChatMethodGenerator from './ChatMethodGenerator.tsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import SubmissionFormSettingPopper from './SubmissionFormSettingPopper.tsx';
import ConfirmationDialog from './ConfirmationDialog.tsx';

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
        fontSize: '22px',
        cursor: 'pointer',
      }}
      onClick={setIsSolution}
    />
  );
};

const SubmissionForm = ({
  simplified,
  selectedSubmission,
}: {
  simplified?: boolean;
  selectedSubmission?: any;
}) => {
  const { problemId, submissionId } = useParams() as any;
  const { pathname } = useLocation();
  const [localProblemId, setLocalProblemId] = useState(null);
  const [readOnly, setReadOnly] = useState(false);
  const [deleteSubmission] = useMutation(DELETE_SUBMISSION, {
    variables: { id: submissionId },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleDelete = () => {
    setIsDialogOpen(true);
  };
  const handleConfirmDelete = () => {
    deleteSubmission().then((res) => {
      if (res.data.deleteSubmission.ok) {
        console.log('deleted');
        if (problemId) navigate(`/problems/${problemId}/submissions`);
        else if (submissionId) navigate(`/submissions`);
      } else {
        console.log('error');
        alert('error deleting submission: ' + submissionId);
      }
    });
    setIsDialogOpen(false);
  };
  const handleCancel = () => {
    setIsDialogOpen(false);
  };
  useEffect(() => {
    if (pathname.includes('new') || pathname.includes('edit')) {
      setReadOnly(false);
    } else {
      setReadOnly(true);
    }
  }, [pathname]);
  const navigate = useNavigate();

  const {
    data: submissionDetailData,
    loading: submissionDetailLoading,
    error: submissionDetailError,
  } = useQuery(FETCH_SUBMISSION, {
    skip: !submissionId && !selectedSubmission?.id,
    variables: { id: submissionId ? +submissionId : +selectedSubmission?.id },
  });

  const {
    loading: singleProblemLoading,
    error: singleProblemError,
    data: problemData,
  } = useQuery(FETCH_PROBLEM, {
    skip: !problemId && !localProblemId,
    variables: {
      id: problemId ? +problemId : localProblemId ? +localProblemId : 0,
    },
  });
  const {
    loading: allProblemsLoading,
    error: allProblemsError,
    data: allProblemsData,
  } = useQuery(FETCH_ALL_PROBLEMS, {
    skip: problemId || localProblemId,
  });
  const showFixedProblemTitleInSelection = problemId || localProblemId;

  const [data, setData] = useState<any>({
    code: '',
    proficiencyLevel: '',
    submittedAt: dtToLocalISO16(new Date()),
    duration: '',
    isSolution: false,
    isWhiteboardMode: false,
    isInterviewMode: false,
    methods: [],
    problem: problemId,
    timeComplexity: '',
    spaceComplexity: '',
  });

  useEffect(() => {
    if (submissionDetailData) {
      setData({
        ...submissionDetailData.submissionById,
        timeComplexity:
          submissionDetailData.submissionById.timeComplexity?.toLowerCase(),
        spaceComplexity:
          submissionDetailData.submissionById.spaceComplexity?.toLowerCase(),

        submittedAt: dtToLocalISO16(
          new Date(submissionDetailData.submissionById.submittedAt)
        ),
        methods: submissionDetailData.submissionById.methods.map(
          (method: any) => +method.id
        ),
      });
      setLocalProblemId(submissionDetailData.submissionById.problem?.id);
    } else if (selectedSubmission) {
      setData({
        ...selectedSubmission,
      });
      setLocalProblemId(selectedSubmission?.problem?.id);
    }
  }, [submissionDetailData, selectedSubmission]);

  const [createOrEditSubmission] = useMutation(CREATE_SUBMISSION);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const input = {
      code: data?.code,
      proficiencyLevel: data?.proficiencyLevel?.toLowerCase(),
      isInterviewMode: data?.isInterviewMode,
      isWhiteboardMode: data?.isWhiteboardMode,
      isSolution: data?.isSolution,
      duration: +data?.duration,
      submittedAt: new Date(data?.submittedAt + ':00').toISOString(),
      timeComplexity: data?.timeComplexity,
      spaceComplexity: data?.spaceComplexity,
      problem: +data?.problem?.id,
    } as any;
    if (data?.id || submissionId) {
      input['id'] = data?.id || submissionId;
    }
    createOrEditSubmission({
      variables: { input },
    })
      .then((res) => {
        console.log('res', res);
        showFixedProblemTitleInSelection
          ? navigate(`/problems/${problemId || localProblemId}/submissions`)
          : navigate(`/submissions`);
      })
      .catch((err) => console.error(err));
  };

  const handleDateTimeChange = (type: 'date' | 'time', value: string) => {
    const [currentDate, currentTime] = data?.submittedAt?.split('T');
    const newDateTime =
      type === 'date' ? `${value}T${currentTime}` : `${currentDate}T${value}`;
    console.log('newDateTime', newDateTime);
    setData((prev: any) => ({ ...prev, submittedAt: newDateTime }));
  };

  const [codeBlockHeight, setCodeBlockHeight] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
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
    if (problemData) {
      setSelected(
        allProblemsData?.allProblems && allProblemsData?.allProblems.length > 0
          ? [{ id: '', leetcodeNumber: '', title: '' }]
          : [problemData?.problemById]
      );
      if (allProblemsData?.allProblems?.length > 0) {
        console.log('no....');
        setOptions(allProblemsData?.allProblems);
      } else {
        console.log('nonono.....');
        setOptions([problemData?.problemById]);
      }
    } else if (allProblemsData?.allProblems) {
      setSelected([]);
      setOptions(allProblemsData?.allProblems);
    }
  }, [problemData, allProblemsData]);
  const [moreInfoOpacity, setMoreInfoOpacity] = useState(0.5);

  if (singleProblemLoading || allProblemsLoading) return <p>Loading...</p>;
  if (singleProblemError) return <p>Error: {singleProblemError.message}</p>;
  if (allProblemsError) return <p>Error: {allProblemsError.message}</p>;
  if (submissionDetailLoading) return <p>Loading...</p>;
  if (submissionDetailError)
    return <p>Error: {submissionDetailError.message}</p>;

  if (simplified) {
    return (
      <div style={{ position: 'relative' }}>
        <CodeEditor
          width="100%"
          height="60vh"
          language="python"
          value={data?.code}
          onChange={(value: string) => {
            setData((prev: any) => ({ ...prev, code: value }));
          }}
          // value={selectedSubmission?.code}
          showLineNumbers={true}
          theme="vs-dark"
          // readOnly={readOnly}
          readOnly={false}
        />
        <div className="d-flex gap-1 align-items-center justify-content-between">
          <div
            style={{
              display: selectedSubmission ? 'block' : 'none',
              opacity: moreInfoOpacity,
            }}
            className="d-flex gap-2 align-items-center"
            onMouseEnter={() => setMoreInfoOpacity(1)}
            onMouseLeave={() => setMoreInfoOpacity(0.5)}
          >
            <SubmissionFormSettingPopper
              position="top-start"
              complexityOptions={Object.keys(BIG_O_COMPLEXITY_DISPLAY)}
              proficiencyLevelOptions={Object.keys(PROFICIENCY_LEVEL_DISPLAY)}
              submittedAt={data?.submittedAt}
              setSubmittedAt={(newSubmittedAt: any) => {
                setData((prev: any) => ({
                  ...prev,
                  submittedAt: newSubmittedAt,
                }));
              }}
              duration={data?.duration}
              setDuration={(newDuration: any) => {
                setData((prev: any) => ({
                  ...prev,
                  duration: newDuration,
                }));
              }}
              isSolution={data?.isSolution}
              setIsSolution={(_: any) => {
                setData((prev: any) => ({
                  ...prev,
                  isSolution: !prev.isSolution,
                }));
              }}
              isWhiteboardMode={data?.isWhiteboardMode}
              setIsWhiteboardMode={(_: any) => {
                setData((prev: any) => ({
                  ...prev,
                  isWhiteboardMode: !prev.isWhiteboardMode,
                }));
              }}
              isInterviewMode={data?.isInterviewMode}
              setIsInterviewMode={(_: any) => {
                setData((prev: any) => ({
                  ...prev,
                  isInterviewMode: !prev.isInterviewMode,
                }));
              }}
              timeComplexity={data?.timeComplexity}
              setTimeComplexity={(newTimeComplexity: any) => {
                setData((prev: any) => ({
                  ...prev,
                  timeComplexity: newTimeComplexity,
                }));
              }}
              spaceComplexity={data?.spaceComplexity}
              setSpaceComplexity={(newSpaceComplexity: any) => {
                setData((prev: any) => ({
                  ...prev,
                  spaceComplexity: newSpaceComplexity,
                }));
              }}
              proficiencyLevel={data?.proficiencyLevel}
              setProficiencyLevel={(newProficiencyLevel: any) => {
                setData((prev: any) => ({
                  ...prev,
                  proficiencyLevel: newProficiencyLevel,
                }));
              }}
              handleSubmit={handleSubmit}
            />
            <FontAwesomeIcon
              icon={faTrash}
              onClick={handleDelete}
              style={{ cursor: 'pointer', fontSize: '20px', marginTop: '10px' }}
              className="text-primary ms-2"
            />
          </div>

          <div>
            <button className="btn btn-outline-primary btn-sm mt-2">
              Notes
            </button>
            <button
              className="btn btn-outline-primary btn-sm mt-2 ms-2"
              onClick={() =>
                navigate(`/submissions/${selectedSubmission?.id}/edit`)
              }
            >
              +
            </button>
          </div>
        </div>
        <ConfirmationDialog
          open={isDialogOpen}
          title="Delete Submission"
          message="Are you sure?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancel}
        />
      </div>
    );
  }

  return (
    <div className="container mt-5 overflow-y-auto" ref={parentRef}>
      <form className="d-flex flex-row gap-5" onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-2 flex-fill">
          <div className="d-flex flex-row align-items-baseline justify-content-start gap-3">
            <h3 className="container-header">
              {submissionId
                ? `${data?.problem?.leetcodeNumber}. ${data?.problem?.title}`
                : 'Select Problem'}{' '}
            </h3>
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
              disabled={readOnly || showFixedProblemTitleInSelection}
              renderInput={(props) => {
                const { inputRef, referenceElementRef, ...inputProps } = props;
                return (
                  <input
                    id="select-problem-inside-typeahead"
                    {...inputProps}
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
                disabled={readOnly}
              >
                <option value="" disabled></option>
                {Object.keys(PROFICIENCY_LEVEL_DISPLAY).map((level) => (
                  <option key={level} value={level?.toLowerCase()}>
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
                  value={data?.timeComplexity || ''}
                  onChange={(e) => {
                    setData((prev: any) => ({
                      ...prev,
                      timeComplexity: e.target.value,
                    }));
                  }}
                  disabled={readOnly}
                >
                  <option value="">{/* <option value="" disabled> */}</option>
                  {Object.keys(BIG_O_COMPLEXITY_DISPLAY).map((level) => (
                    <option
                      key={level}
                      value={level?.toLowerCase()}
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
                  value={data?.spaceComplexity || ''}
                  onChange={(e) => {
                    setData((prev: any) => ({
                      ...prev,
                      spaceComplexity: e.target.value,
                    }));
                  }}
                  disabled={readOnly}
                >
                  <option value="">{/* <option value="" disabled> */}</option>
                  {Object.keys(BIG_O_COMPLEXITY_DISPLAY).map((level) => (
                    <option
                      key={level}
                      value={level?.toLowerCase()}
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
                  readOnly={readOnly}
                />
                <input
                  className="form-control ms-2"
                  type="time"
                  value={data?.submittedAt.split('T')[1]}
                  onChange={(e) => handleDateTimeChange('time', e.target.value)}
                  readOnly={readOnly}
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
                readOnly={readOnly}
              />
            </div>
          </div>

          <div className="d-flex mt-3">
            <div className="w-50">
              <ChatMethodGenerator data={data} setData={setData} />
            </div>

            <div className="d-flex flex-column gap-1 mt-2">
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
                  disabled={readOnly}
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
                  disabled={readOnly}
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

          {!readOnly && (
            <button type="submit" className="btn btn-outline-primary mt-1">
              Submit
            </button>
          )}
        </div>

        <div className="d-flex flex-column flex-fill">
          <div className="d-flex flex-row justify-content-between align-items-baseline">
            <label className="text-gray">Code</label>
            {!readOnly && <Timer />}
            {readOnly && (
              <div className="d-flex gap-4">
                <FontAwesomeIcon
                  icon={faEdit}
                  onClick={() => {
                    setReadOnly(false);
                    navigate(`/submissions/${submissionId}/edit`);
                  }}
                  style={{ cursor: 'pointer', fontSize: '20px' }}
                  className="text-primary mb-3"
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={() => {
                    handleDelete();
                  }}
                  style={{ cursor: 'pointer', fontSize: '20px' }}
                  className="text-primary mb-3"
                />
              </div>
            )}
          </div>
          <CodeEditor
            width="100%"
            height={`${
              codeBlockHeight - 100 > 100 ? codeBlockHeight - 100 : 400
            }px`}
            language={data?.isWhiteboardMode ? 'plaintext' : 'python'}
            value={data?.code}
            showLineNumbers={true}
            theme="vs-dark"
            onChange={(value: string) => {
              setData((prev: any) => ({ ...prev, code: value }));
            }}
            readOnly={readOnly}
          />
        </div>
      </form>
      <ConfirmationDialog
        open={isDialogOpen}
        title="Delete Submission"
        message="Are you sure you want to delete this submission?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default SubmissionForm;

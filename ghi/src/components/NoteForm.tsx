import { useCallback, useEffect, useRef, useState } from 'react';
import CodeEditor from './CodeEditor';
import { dtToLocalISO16 } from '../utils/timeUtils';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FETCH_PROBLEM,
  FETCH_ALL_PROBLEMS,
  CREATE_SUBMISSION_NOTE,
  CREATE_PROBLEM_NOTE,
  FETCH_SUBMISSION,
} from './NoteFormQueries';
import { useQuery, useMutation } from '@apollo/client';
import NoteFormTypeAhead from './NoteFormTypeAhead';

export const NoteType = {
  INTUITION: ['intuition', 'intuition'],
  STUCK_POINT: ['stuck_point', 'stuck point'],
  QNA: ['qna', 'Q&A'],
  ERR: ['err', 'error'],
  MEMO: ['memo', 'memo'],
};

const NoteForm = ({ inDrawer = false }) => {
  const [data, setData] = useState<any>({
    title: '',
    content: '',
    submittedAt: dtToLocalISO16(new Date()),
    isStarred: false,
    noteType: NoteType.ERR[0],
    startLineNumber: 0,
    endLineNumber: 0,
  });
  const navigate = useNavigate();
  const [parsedProblemId, setParsedProblemId] = useState<any>(null);
  const { problemId, submissionId } = useParams();
  const {
    data: { allProblems } = { allProblems: [] },
    loading: allProblemsLoading,
    error: allProblemsError,
  } = useQuery(FETCH_ALL_PROBLEMS);

  const { data: { problemById: problemDetails } = { problemDetails: {} } } =
    useQuery(FETCH_PROBLEM, {
      variables: {
        id: problemId ? +problemId : parsedProblemId ? +parsedProblemId : 0,
      },
      skip: !problemId && !parsedProblemId,
    });

  const {
    data: { submissionById: submissionDetails } = { submissionDetails: {} },
  } = useQuery(FETCH_SUBMISSION, {
    variables: { id: submissionId ? +submissionId : 0 },
    skip: !submissionId,
  });

  // if !submissionId && !problemId then select problem
  // otherwise, show problem title

  const [createProblemNote] = useMutation(CREATE_PROBLEM_NOTE, {
    variables: {
      input: {
        ...data,
        startLineNumber: +data?.startLineNumber,
        endLineNumber: +data?.endLineNumber,
        submittedAt: new Date(data?.submittedAt + ':00'),
        problem: +data.problem || (problemId ? (+problemId as number) : 0),
      },
    },
  });

  const [createSubmissionNote] = useMutation(CREATE_SUBMISSION_NOTE, {
    variables: {
      input: {
        ...data,
        startLineNumber: +data?.startLineNumber,
        endLineNumber: +data?.endLineNumber,
        submittedAt: new Date(data?.submittedAt + ':00'),
        submission: submissionId ? +submissionId : 0,
      },
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();

    if (problemId) {
      console.log('has problemId');
      createProblemNote();
    } else if (submissionId) {
      console.log('has submissionId');
      console.log('data', data);
      createSubmissionNote();
    } else if (data?.problem) {
      console.log('has data.problem');
      console.log('data', data);
      createProblemNote()
        .then((res) => console.log('res', res))
        .catch((err) => console.error(err));
    } else {
      console.log('no problem selected');
    }

    problemId ? navigate(`/problems/${problemId}/notes`) : navigate(`/notes`);
  };

  // useEffect(() => {
  //   if (problemId) {
  //     setData((prev: any) => ({ ...prev, problem: problemId }));
  //   }
  //   if (submissionId) {
  //     setData((prev: any) => ({ ...prev, submission: submissionId }));
  //     setParsedProblemId(submissionDetails?.problem?.id);
  //   }
  //   // console.log(
  //   //   'submissionDetails',
  //   //   submissionDetails,
  //   //   submissionId,
  //   //   problemId,
  //   //   parsedProblemId
  //   // );
  // }, [problemId, submissionId, submissionDetails, setParsedProblemId, setData]);

  const handleDateTimeChange = (type: 'date' | 'time', value: string) => {
    const [currentDate, currentTime] = data?.submittedAt?.split('T');
    const newDateTime =
      type === 'date' ? `${value}T${currentTime}` : `${currentDate}T${value}`;
    setData((prev: any) => ({ ...prev, submittedAt: newDateTime }));
  };

  const [codeBlockHeight, setCodeBlockHeight] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);

  const handleSelectionChange = useCallback((selectedProblem: any) => {
    const selectedId = selectedProblem[0] ? selectedProblem[0].id : null;
    setData((prev: any) => ({
      ...prev,
      problem: selectedId,
    }));
    setSelected(selectedProblem || []);
  }, []);
  useEffect(() => {
    if (allProblems && Array.isArray(allProblems)) {
      setOptions(allProblems);
    }
    if (problemDetails && typeof problemDetails === 'object') {
      setSelected([problemDetails]);
    }
  }, [allProblems, problemDetails]);
  useEffect(() => {
    if (problemId || submissionId) setOptions([problemDetails]);
    else if (allProblems && allProblems.length > 0) {
      setOptions(allProblems);
      setSelected([
        {
          id: '',
          leetcodeNumber: '',
          title: '',
        },
      ]);
    }
  }, [allProblems, problemDetails]);
  useEffect(() => {
    if (parentRef?.current?.clientHeight) {
      setCodeBlockHeight(parentRef?.current?.clientHeight);
    }
  }, [parentRef]);

  useEffect(() => {
    if (problemId && data.problem !== problemId) {
      setData((prev: any) => ({ ...prev, problem: problemId }));
    }
    if (submissionId && data.submission !== submissionId) {
      setData((prev: any) => ({ ...prev, submission: submissionId }));
      if (submissionDetails?.problem?.id !== parsedProblemId) {
        setParsedProblemId(submissionDetails?.problem?.id);
      }
    }
  }, [problemId, submissionId, submissionDetails, parsedProblemId]);

  return (
    <div
      className={`container ${inDrawer ? '' : 'mt-5'} overflow-y-auto`}
      ref={parentRef}
    >
      <form className="d-flex flex-row gap-5" onSubmit={handleSubmit}>
        <div className="d-flex flex-column flex-fill">
          <h3 className="page-header mb-2">New Note</h3>
          {allProblems && allProblems.length > 0 && (
            <div className="form-group col-md-12 mb-2">
              <label className="mb-2">
                {problemId || submissionId ? 'Problem' : 'Select Problem'}
                {!problemId && !submissionId && (
                  <span className="required-asterisk"> *</span>
                )}
              </label>
              <NoteFormTypeAhead
                selected={selected}
                options={options}
                problemId={problemId}
                submissionId={submissionId}
                handleSelectionChange={handleSelectionChange}
              />
              {/* <Typeahead
                className="form-control"
                id="select-problem-typeahead"
                labelKey={(option: any) =>
                  `${option?.leetcodeNumber || 0} ${option?.title || ''}`
                }
                selected={selected}
                options={options}
                disabled={!!problemId || !!submissionId}
                renderInput={(props) => {
                  const { inputRef, referenceElementRef, ...inputProps } =
                    props;
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
                placeholder="Choose a LeetCode problem..."
                onChange={handleSelectionChange}
                renderMenuItemChildren={(option: any) => (
                  <div>
                    {option?.leetcodeNumber} - {option?.title}
                  </div>
                )}
              /> */}
            </div>
          )}

          <div className="form-group mb-2">
            <label className="mb-2">Title</label>
            <input
              className="form-control"
              type="text"
              value={data?.title}
              onChange={(e) =>
                setData((prev: any) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          {/* <div className="form-group mb-2">
            <label className="mb-2">Content</label>
            <span className="required-asterisk">
              {' '}
              *
            </span>
            <textarea
              className="form-control"
              value={data?.content}
              onChange={(e) =>
                setData((prev: any) => ({ ...prev, content: e.target.value }))
              }
              required
            />
          </div> */}

          <div className="form-group mb-2">
            <label className="mb-2">Note Type</label>
            <select
              className="form-control"
              value={data?.noteType}
              onChange={(e) => {
                setData((prev: any) => ({
                  ...prev,
                  noteType: e.target.value,
                }));
              }}
            >
              {Object.values(NoteType).map((level) => (
                <option key={level[0]} value={level[0]}>
                  {level[1]}
                </option>
              ))}
            </select>
          </div>

          <div className={submissionId ? 'd-flex flex-row' : ''}>
            <div className={`form-group ${submissionId ? 'col-md-6' : ''}`}>
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

            {submissionId && (
              <div className="form-row d-flex ms-2">
                <div className="form-group col-md-6">
                  <label className="mb-2">line start:</label>
                  <input
                    className="form-control"
                    type="number"
                    value={data?.startLineNumber}
                    onChange={(e) =>
                      setData((prev: any) => ({
                        ...prev,
                        startLineNumber: e.target.value,
                      }))
                    }
                    min="0"
                    onInput={(e) => {
                      const input = e.target as HTMLInputElement;
                      if (Number(input.value) < 0) input.value = '0';
                    }}
                  />
                </div>
                <div className="form-group ms-2">
                  <label className="mb-2">end:</label>
                  <input
                    className="form-control"
                    type="number"
                    value={data?.endLineNumber}
                    onChange={(e) =>
                      setData((prev: any) => ({
                        ...prev,
                        endLineNumber: e.target.value,
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
            )}
          </div>

          <div className="form-check form-switch mt-2 mb-2">
            <label className="form-check-label" htmlFor="isStarred">
              Star this note
            </label>
            <input
              className="form-check-input"
              type="checkbox"
              id="isStarred"
              checked={data?.isStarred}
              onChange={(e) =>
                setData((prev: any) => ({
                  ...prev,
                  isStarred: e.target.checked,
                }))
              }
            />
          </div>

          <button type="submit" className="btn btn-outline-primary mt-5">
            Submit
          </button>
        </div>
        <div className="d-flex flex-column flex-fill" style={{ flex: 1 }}>
          <label className="mb-2">Content</label>
          <CodeEditor
            width="100%"
            height={codeBlockHeight + 'px'}
            placeholder="Enter your code here..."
            language="python"
            value={data?.content}
            showLineNumbers={true}
            theme="vs-dark"
            readOnly={false}
            onChange={(value: string) => {
              setData((prev: any) => ({ ...prev, content: value }));
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default NoteForm;

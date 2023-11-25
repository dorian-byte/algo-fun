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
} from './NoteQueries';
import { useQuery, useMutation } from '@apollo/client';
import NoteFormTypeAhead from './NoteFormTypeAhead';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const StarNote = ({
  isStarred,
  setStarred,
}: {
  isStarred: boolean;
  setStarred: () => void;
}) => {
  return (
    <FontAwesomeIcon
      icon={faStar}
      onClick={setStarred}
      style={{
        color: isStarred ? 'orange' : 'grey',
        cursor: 'pointer',
        fontSize: '28px',
      }}
    />
  );
};
export const NoteType = {
  INTUITION: ['intuition', 'Intuition'],
  STUCK_POINT: ['stuck_point', 'Stuck point'],
  QNA: ['qna', 'Q&A'],
  ERR: ['err', 'Error'],
  MEMO: ['memo', 'Memo'],
};

// const NoteForm = ({ inDrawer = false, simplified = false, height }: any) => {
const NoteForm = () => {
  const [starOpacity, setStarOpacity] = useState<number>(0.5);
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
    // loading: allProblemsLoading,
    // error: allProblemsError,
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
      createProblemNote().then((_) => navigate(`/problems/${problemId}/notes`));
    } else if (submissionId) {
      console.log('has submissionId');
      console.log('data', data);
      createSubmissionNote().then((_) =>
        navigate(`/submissions/${submissionId}/notes`)
      );
    } else if (data?.problem) {
      console.log('has data.problem');
      console.log('data', data);
      createProblemNote()
        .then((res) => {
          console.log('res', res);
          // here data.problem's value is the problem id
          navigate(`/problems/${data.problem}/notes`);
        })
        .catch((err) => console.error(err));
    } else {
      console.log('no problem selected');
    }

    // problemId ? navigate(`/problems/${problemId}/notes`) : navigate(`/notes`);
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
  const ref = useRef<HTMLDivElement>(null);

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
    <form
      className="d-flex flex-row gap-3 flex-fill h-100 position-relative"
      onSubmit={handleSubmit}
    >
      <div className="d-flex flex-column flex-fill h-100 gap-5" ref={ref}>
        {allProblems && allProblems.length > 0 && (
          <div className="form-floating col-md-12">
            <NoteFormTypeAhead
              selected={selected}
              options={options}
              problemId={problemId}
              submissionId={submissionId}
              handleSelectionChange={handleSelectionChange}
            />
            <label>
              Problem
              {!problemId && !submissionId && (
                <span className="required-asterisk"> *</span>
              )}
            </label>
          </div>
        )}

        <div className="form-floating">
          <input
            className="form-control"
            type="text"
            value={data?.title}
            onChange={(e) =>
              setData((prev: any) => ({ ...prev, title: e.target.value }))
            }
          />
          <label>Title</label>
        </div>

        <div className="form-floating">
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
            <option value="" disabled></option>
            {Object.values(NoteType).map((level) => (
              <option key={level[0]} value={level[0]}>
                {level[1]}
              </option>
            ))}
          </select>
          <label>
            Note Type
            <span className="required-asterisk"> *</span>
          </label>
        </div>

        <div className={submissionId ? 'd-flex flex-row' : ''}>
          <div className={`form-group ${submissionId ? 'col-md-6' : ''}`}>
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

          {submissionId && (
            <div className="form-row d-flex ms-5">
              <div className="form-group col-md-4">
                <label className="text-gray small mb-1">Line Start</label>
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
              <div className="form-group ms-2 col-md-4">
                <label className="text-gray small mb-1">End</label>
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

        {/* <div className="form-check form-switch mt-4">
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
          </div> */}

        <button type="submit" className="btn btn-outline-primary">
          Submit
        </button>
      </div>
      <div className="d-flex flex-column flex-fill">
        <CodeEditor
          width="100%"
          height={ref?.current?.clientHeight + 'px'}
          language="python"
          value={data?.content || '// Write your note here'}
          showLineNumbers={true}
          theme="vs-dark"
          readOnly={false}
          onChange={(value: string) => {
            setData((prev: any) => ({ ...prev, content: value }));
          }}
        />
      </div>
      <div
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          opacity: starOpacity,
        }}
        onMouseEnter={() => setStarOpacity(1)}
        onMouseLeave={() => setStarOpacity(0.5)}
      >
        <StarNote
          isStarred={data?.isStarred}
          setStarred={() => {
            setData((prev: any) => ({
              ...prev,
              isStarred: !prev.isStarred,
            }));
          }}
        />
      </div>
    </form>
  );
};

export default NoteForm;

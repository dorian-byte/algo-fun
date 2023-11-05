import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import CodeEditor from '../components/CodeEditor';
import Timer from '../components/Timer';
import { dtToLocalISO16 } from '../utils/timeUtils';
import { CREATE_SUBMISSION } from './SubmissionCreatePage';
import { useMutation } from '@apollo/client';
import {
  BIG_O_COMPLEXITY_DISPLAY,
  PROFICIENCY_LEVEL_DISPLAY,
} from '../components/SubmissionList';
import FormDrawer from '../components/DrawerWrapper';
import SubmissionList from '../components/SubmissionList';
import MethodGenerator from '../components/MethodGenerator';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { AppBar, Toolbar } from '@mui/material';

const FrequencyBar = ({ frequency }: { frequency: number }) => {
  const segmentWidth = 7; // each segment is 7px wide
  const segments = Array.from({ length: 10 }, (_, i) => i + 1);
  const filledSegments = Math.ceil((frequency / 100) * 10);

  return (
    <div className="bar-container">
      {segments.map((_, index) => {
        const isFilled = index < filledSegments;
        const color = isFilled
          ? `rgb(255, ${255 - index * 25.5}, ${index * 25.5})`
          : '#ccc';
        return (
          <div
            key={index}
            className="bar-segment"
            style={{ width: `${segmentWidth}px`, backgroundColor: color }}
          ></div>
        );
      })}
    </div>
  );
};

const PROBLEM_BY_ID = gql`
  query ProblemById($id: Int!) {
    problemById(id: $id) {
      id
      title
      leetcodeNumber
      description
      createdAt
      updatedAt
      difficulty
      timeComplexityRequirement
      spaceComplexityRequirement
      companies {
        id
        name
      }
      topics {
        id
        name
      }
      source {
        id
        name
      }
      url
      lintcodeEquivalentProblemNumber
      lintcodeEquivalentProblemUrl
      askedByFaang
      acceptanceRate
      frequency
      similarProblems {
        id
        title
        url
        difficulty
      }
      submissions {
        id
        code
        proficiencyLevel
        submittedAt
        duration
        isSolution
        isWhiteboardMode
        isInterviewMode
        timeComplexity
        spaceComplexity
      }
    }
  }
`;

const ProblemDetailPage = () => {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [problem, setProblem] = useState({} as any);
  const [submissions, setSubmissions] = useState([] as any[]);
  const [submissionData, setSubmissionData] = useState<any>({
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
  const [createSubmission] = useMutation(CREATE_SUBMISSION, {
    variables: {
      input: {
        ...submissionData,
        duration: +submissionData?.duration,
        submittedAt: new Date(submissionData?.submittedAt + ':00'),
        timeComplexity: submissionData?.timeComplexity,
        spaceComplexity: submissionData?.spaceComplexity,
      },
    },
  });
  const handleDateTimeChange = (type: 'date' | 'time', value: string) => {
    const [currentDate, currentTime] = submissionData?.submittedAt?.split('T');
    const newDateTime =
      type === 'date' ? `${value}T${currentTime}` : `${currentDate}T${value}`;
    setSubmissionData((prev: any) => ({ ...prev, submittedAt: newDateTime }));
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    createSubmission()
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => console.error(err));
  };
  const { loading, error, data } = useQuery(PROBLEM_BY_ID, {
    variables: { id: problemId ? +problemId : 0 },
  });
  useEffect(() => {
    if (data) {
      console.log(data);
      setProblem(data.problemById);
      setSubmissions(data.problemById.submissions);
    }
  }, [data]);

  useEffect(() => {
    console.log('submissions', submissions);
  }, submissions);

  const [value, setValue] = useState('1');
  const handleChange = (_e: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  if (error) return <p>Error :( {error.message}</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <div
      className="overflow-y-auto mt-4 d-flex gap-1 justify-content-around"
      style={{ height: '85vh' }}
    >
      <div className="border border-light bg-dark rounded overflow-y-auto w-50">
        <TabContext value={value}>
          <AppBar position="sticky" sx={{ bgcolor: '#303030' }}>
            <Toolbar>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                textColor="inherit"
                TabIndicatorProps={{ style: { background: '#fff' } }}
              >
                <Tab label="Problem Detail" value="1" />
                <Tab label="Submissions" value="2" />
                <Tab label="GPT" value="3" />
              </TabList>
            </Toolbar>
          </AppBar>
          <TabPanel value="1">
            <div className="d-flex align-items-center justify-content-between">
              <h3 className="mb-2">
                {problem.leetcodeNumber}. {problem.title}
              </h3>
              <div className="d-flex gap-3 align-items-center">
                <div className="badge badge-outlined border">
                  {problem.acceptanceRate}% accepted
                </div>
                <FrequencyBar frequency={problem.frequency} />
              </div>
            </div>
            <div className="d-flex p-2 gap-2 mb-1">
              <div className="badge bg-success">{problem.difficulty}</div>
              <div className="badge bg-warning text-dark">topics</div>
              {problem.askedByFaang && (
                <div className="badge bg-info text-dark">FANNG</div>
              )}
            </div>
            <CodeEditor
              height="40vh"
              value={problem.description}
              language="markdown"
              showLineNumbers={false}
              theme="vs-dark"
              readOnly={true}
            />
            <h5 className="mt-5 mb-3">Similar Questions</h5>
            <div className="d-flex gap-3 flex-wrap">
              {problem?.similarProblems?.map((p: any) => {
                const difficulty = p.difficulty.toLowerCase();
                const color =
                  difficulty === 'easy'
                    ? 'success'
                    : difficulty === 'medium'
                    ? 'orange'
                    : 'danger';
                return (
                  <div
                    className={`badge badge-outlined bg-transparent text-${color} border border-${color}`}
                    onClick={() => {
                      navigate(`/problems/${p.id}`);
                    }}
                  >
                    {p.title}
                  </div>
                );
              })}
            </div>
          </TabPanel>
          <TabPanel value="2">
            <SubmissionList submissions={submissions} simplified={true} />
          </TabPanel>
        </TabContext>
      </div>

      <div className="border border-light p-4 bg-dark rounded w-50">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="mb-3">New Submission</h3>
          <div className="d-flex align-items-center gap-2">
            <Timer />
            <FormDrawer
              width={'400px'}
              renderOpenner={(cb) => <Openner cb={cb} />}
            >
              <form className="d-flex flex-row gap-5" onSubmit={handleSubmit}>
                <div className="d-flex flex-column gap-5">
                  <div className="form-floating">
                    <select
                      className="form-control"
                      value={submissionData?.proficiencyLevel}
                      onChange={(e) => {
                        setSubmissionData((prev: any) => ({
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

                  <div className="d-flex flex-row gap-3">
                    <div className="form-floating">
                      <select
                        id="o-time"
                        // className="form-select"
                        className="form-control"
                        value={submissionData?.timeComplexity}
                        onChange={(e) => {
                          setSubmissionData((prev: any) => ({
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
                        className="form-control"
                        value={submissionData?.spaceComplexity}
                        onChange={(e) => {
                          setSubmissionData((prev: any) => ({
                            ...prev,
                            spaceComplexity: e.target.value,
                          }));
                        }}
                      >
                        <option value="" selected></option>
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
                      <label htmlFor="o-space">Space</label>
                    </div>
                  </div>

                  <div className="d-flex flex-row mt-3 justify-content-between">
                    <div className="form-group flex-fill">
                      <label className="text-gray small mb-1">
                        Submitted At
                      </label>
                      <div className="d-flex flex-row">
                        <input
                          className="form-control"
                          type="date"
                          value={submissionData?.submittedAt.split('T')[0]}
                          onChange={(e) =>
                            handleDateTimeChange('date', e.target.value)
                          }
                        />
                        <input
                          className="form-control ms-2"
                          type="time"
                          value={submissionData?.submittedAt.split('T')[1]}
                          onChange={(e) =>
                            handleDateTimeChange('time', e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-gray small mb-1">
                          Mins Used
                        </label>
                        <input
                          className="form-control"
                          type="number"
                          value={submissionData?.duration}
                          placeholder="Mins Used"
                          onChange={(e) =>
                            setSubmissionData((prev: any) => ({
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
                  </div>

                  <div className="mt-3">
                    <div className="d-flex flex-column gap-1 ">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isSolutionSwitch"
                          checked={submissionData?.isSolution}
                          onChange={(e) =>
                            setSubmissionData((prev: any) => ({
                              ...prev,
                              isSolution: e.target.checked,
                            }))
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="isSolutionSwitch"
                        >
                          Best Solution
                        </label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isWhiteboardModeSwitch"
                          checked={submissionData?.isWhiteboardMode}
                          onChange={(e) =>
                            setSubmissionData((prev: any) => ({
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
                          checked={submissionData?.isInterviewMode}
                          onChange={(e) =>
                            setSubmissionData((prev: any) => ({
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
                  <MethodGenerator
                    data={submissionData}
                    setData={setSubmissionData}
                  />

                  {/* <button
                    type="submit"
                    className="btn btn-outline-primary mt-4 mb-5"
                  >
                    Submit
                  </button> */}
                </div>
              </form>
            </FormDrawer>
          </div>
        </div>
        <CodeEditor
          width="100%"
          height="68vh"
          value={submissionData.code}
          language="python"
          showLineNumbers={false}
          theme="vs-dark"
          readOnly={false}
          onChange={(value) => {
            setSubmissionData((prev: any) => ({ ...prev, code: value }));
          }}
        />
        <div className="w-100 d-flex justify-content-end mt-2">
          <button
            disabled={!submissionData.code}
            onClick={handleSubmit}
            className="btn btn-primary w-100"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const Openner = ({ cb }: { cb: () => void }) => {
  return (
    <div
      className="badge badge-outlined text-orange border border-orange"
      style={{ cursor: 'pointer' }}
      onClick={cb() as any}
    >
      more settings
    </div>
  );
};

export default ProblemDetailPage;

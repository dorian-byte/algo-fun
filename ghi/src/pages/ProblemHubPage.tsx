import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { dtToLocalISO16 } from '../utils/timeUtils';
import { CREATE_SUBMISSION } from '../graphql/submissionQueries';
import { useMutation } from '@apollo/client';
import SubmissionList from '../components/SubmissionList';
import ChatSubmissionAnalyzer from '../components/ChatSubmissionAnalyzer';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { AppBar, Toolbar } from '@mui/material';
import { getChatResponse } from '../utils/queryChat';
import { requestWrapper } from '../components/ChatSubmissionAnalyzer';
import SubmissionFormInTab from '../components/SubmissionFormInTab';
import SubmissionDetailPage from './SubmissionDetailPage';
import ProblemDetail from '../components/ProblemDetail';
import NoteForm from '../components/NoteForm';
import ProblemNoteListTab from '../components/ProblemNoteListTab';

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

const ProblemHubPage = () => {
  const { problemId } = useParams();
  const [problem, setProblem] = useState({} as any);
  const [submissions, setSubmissions] = useState([] as any[]);
  const [selectedSubmission, setSelectedSubmission] = useState();
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
  const [chatloading, setChatLoading] = useState(false);
  const [chatResponse, setChatResponse] = useState('');
  const handleSubmit = (e: any) => {
    e.preventDefault();
    createSubmission()
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => console.error(err));
  };
  const handleAnalyze = (e: any) => {
    e.preventDefault();
    setLeftTabValue('4');
    if (!submissionData.code) return;
    setChatLoading(true);
    getChatResponse({
      setLoading: setChatLoading,
      setChatResponse,
      query: requestWrapper(submissionData.code),
    }).then(() => setChatLoading(false));
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

  const [leftTabValue, setLeftTabValue] = useState('1');
  const [rightTabValue, setRightTabValue] = useState('1');
  const handleLeftTabChange = (_e: React.SyntheticEvent, newValue: string) => {
    setLeftTabValue(newValue);
  };
  const handleRightTabChange = (_e: React.SyntheticEvent, newValue: string) => {
    setRightTabValue(newValue);
  };
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('ref', ref?.current);
  }, [ref]);

  if (error) return <p>Error :( {error.message}</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <div
      className="overflow-y-auto mt-4 d-flex gap-1 justify-content-around"
      style={{ height: '85vh' }}
    >
      <div className="border border-light bg-dark rounded overflow-y-auto w-50">
        <TabContext value={leftTabValue}>
          <AppBar position="sticky" sx={{ bgcolor: '#303030' }}>
            <Toolbar>
              <TabList
                onChange={handleLeftTabChange}
                textColor="inherit"
                TabIndicatorProps={{ style: { background: '#fff' } }}
              >
                <Tab label="Description" value="1" />
                <Tab label="Solutions" value="2" />
                <Tab label="Submissions" value="3" />
                <Tab label="Submission Analysis" value="4" />
                <Tab label="Problem Notes" value="5" />
              </TabList>
            </Toolbar>
          </AppBar>
          <TabPanel value="1">
            <ProblemDetail
              problem={problem}
              simplified={true}
              setLeftTabValue={setLeftTabValue}
              setRightTabValue={setRightTabValue}
            />
          </TabPanel>
          <TabPanel value="2">
            <SubmissionList
              submissions={submissions.filter((sb) => sb.isSolution)}
              simplified={true}
              rowClickCallback={(params: any) => {
                setRightTabValue('7');
                console.log('p', params);
                setSelectedSubmission(params);
              }}
            />
          </TabPanel>
          <TabPanel value="3">
            <SubmissionList
              submissions={submissions}
              simplified={true}
              rowClickCallback={(row: any) => {
                setRightTabValue('7');
                console.log('p', row);
                setSelectedSubmission(row);
              }}
            />
          </TabPanel>
          <TabPanel value="4">
            <ChatSubmissionAnalyzer
              loading={chatloading}
              chatResponse={chatResponse}
            />
          </TabPanel>
          <TabPanel value="5">
            <ProblemNoteListTab />
          </TabPanel>
        </TabContext>
      </div>

      <div className="border border-light bg-dark rounded w-50">
        <TabContext value={rightTabValue}>
          <AppBar position="sticky" sx={{ bgcolor: '#303030' }}>
            <Toolbar>
              <TabList
                onChange={handleRightTabChange}
                textColor="inherit"
                TabIndicatorProps={{ style: { background: '#fff' } }}
              >
                <Tab label="New Submission" value="6" />
                <Tab label="Submission Detail" value="7" />
                <Tab label="New Note" value="8" />
                <Tab label="undefined 2" value="9" />
              </TabList>
            </Toolbar>
          </AppBar>
          <TabPanel value="6">
            <SubmissionFormInTab
              submissionData={submissionData}
              setSubmissionData={setSubmissionData}
              handleSubmit={handleSubmit}
              handleAnalyze={handleAnalyze}
              handleDateTimeChange={handleDateTimeChange}
              openner={Openner}
            />
          </TabPanel>
          <TabPanel value="7">
            <SubmissionDetailPage
              simplified={true}
              selectedSubmission={selectedSubmission}
            />
          </TabPanel>
          <TabPanel value="8">
            <div className="pt-3">
              <NoteForm />
            </div>
          </TabPanel>
          <TabPanel value="9"></TabPanel>
        </TabContext>
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

export default ProblemHubPage;

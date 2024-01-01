import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { dtToLocalISO16 } from '../utils/timeUtils';
import { CREATE_OR_UPDATE_SUBMISSION } from '../graphql/submissionQueries';
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
import ProblemDashboard from '../components/ProblemDashboard';
import SubmissionNoteCRUDListPage from './SubmissionNoteCRUDListPage';
import NoteListPage from './NoteListPage';

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
      hasNotes
      notesCount
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
        passed
        notes {
          submission {
            id
            problem {
              id
              title
              leetcodeNumber
            }
          }
          id
          title
          content
          createdAt
          updatedAt
          submittedAt
          isStarred
          startLineNumber
          endLineNumber
          resources {
            id
            title
            url
            resourceType
          }
        }
      }
    }
  }
`;

const GET_SELECTED_SUBMISSION = gql`
  query GetSelectedSubmission($id: Int!) {
    submissionById(id: $id) {
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
`;

const ProblemHubPage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { problemId, submissionId } = useParams();
  const [problem, setProblem] = useState({} as any);
  const [submissions, setSubmissions] = useState([] as any[]);
  const [selectedSubmission, setSelectedSubmission] = useState();
  const [submissionParsedFromUrl, setSubmissionParsedFromUrl] = useState();
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const [leftTabValue, setLeftTabValue] = useState<string>('1');
  const [rightTabValue, setRightTabValue] = useState<string>('6');
  const { loading, error, data, refetch } = useQuery(PROBLEM_BY_ID, {
    variables: { id: problemId ? +problemId : 0 },
    skip: !problemId,
  });
  useEffect(() => {
    // console.log('looping?');
    // Hacky fix: possible to exceed maximum rerenders if pathname is changed, but it's not here
    if (pathname.endsWith('submissions/new')) {
      setRightTabValue('7');
      setLeftTabValue('1');
    }
    if (pathname.endsWith('notes')) {
      setRightTabValue('5');
      setLeftTabValue('1');
    }
    if (pathname.endsWith('submissions')) {
      setRightTabValue('6');
      setLeftTabValue('3');
    }
  }, [pathname]);

  useEffect(() => {
    if (!data?.problemById) return;
    if (rightTabValue === '6' && data?.problemById?.submissions.length == 0) {
      setRightTabValue('7');
    }
  }, [rightTabValue, data]);

  useEffect(() => {
    // console.log('looping?');
    if (rightTabValue === '7') {
      setSelectedSubmission(undefined);
      navigate(`/problems/${problemId}/submissions/new`);
    }
  }, [rightTabValue]);

  const { data: submissionParsedFromUrlData, refetch: refetchSubmission } =
    useQuery(GET_SELECTED_SUBMISSION, {
      variables: { id: submissionId ? +submissionId : 0 },
      skip: !submissionId,
    });
  useEffect(() => {
    refetchSubmission();
  }, [submissionId]);

  useEffect(() => {
    if (submissionParsedFromUrlData) {
      setSubmissionParsedFromUrl(submissionParsedFromUrlData.submissionById);
    }
  }, [submissionParsedFromUrlData]);

  useEffect(() => {
    if (submissionParsedFromUrl) {
      setSelectedSubmission(submissionParsedFromUrl);
    }
  }, [submissionParsedFromUrl]);

  useEffect(() => {
    if (selectedSubmission) {
      if (leftTabValue !== '3') setLeftTabValue('2');
      setRightTabValue('8');
    }
  }, [selectedSubmission]);
  const initialSubmissionData = {
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
  };
  const [submissionData, setSubmissionData] = useState<any>({
    ...initialSubmissionData,
  });
  const [createSubmission] = useMutation(CREATE_OR_UPDATE_SUBMISSION, {
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
  const [starredNotes, setStarredNotes] = useState<any[]>([]);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    createSubmission()
      .then((res) => {
        //swap content with newly created submission before switching to display the "submission detail" tab

        navigate(
          `/problems/${problemId}/submissions/${res.data.updateSubmission.submission.id}`
        );
        setSubmissionData({ ...initialSubmissionData });
      })
      .catch((err) => console.error(err));
  };
  const handleAnalyze = (e: any) => {
    e.preventDefault();
    setHasAnalyzed(true);
    setLeftTabValue('4');
    if (!submissionData.code) return;
    setChatLoading(true);
    getChatResponse({
      setLoading: setChatLoading,
      setChatResponse,
      query: requestWrapper(submissionData.code),
    }).then(() => setChatLoading(false));
  };

  useEffect(() => {
    if (data) {
      setProblem(data.problemById);
      setSubmissions(data.problemById.submissions);
      setStarredNotes(() => {
        const starredNotes = data.problemById.submissions
          .map((submission: any) => submission.notes)
          .flat()
          .filter((note: any) => note.isStarred);
        return starredNotes;
      });
    }
  }, [data]);

  const handleLeftTabChange = (_e: React.SyntheticEvent, newValue: string) => {
    setLeftTabValue(newValue);
  };
  const handleRightTabChange = (_e: React.SyntheticEvent, newValue: string) => {
    setRightTabValue(newValue);
  };

  if (error) return <p>Error :( {error.message}</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <div
      className="overflow-y-auto d-flex justify-content-around"
      style={{
        height: 'calc(100vh - 93px)',
        marginTop: '26px',
        border: '2px solid',
        borderRadius: '10px',
        color: 'transparent',
        backgroundImage:
          'linear-gradient( -90deg, rgb(255, 89, 0) 0%, #f38960 30%, rgb(240, 240, 118) 60%, darkorange 100%)',
      }}
    >
      <div className="bg-dark overflow-y-auto w-50 text-white">
        <TabContext value={leftTabValue}>
          <AppBar position="sticky" sx={{ bgcolor: '#303030' }}>
            <Toolbar>
              <TabList
                onChange={handleLeftTabChange}
                textColor="inherit"
                TabIndicatorProps={{ style: { background: '#fff' } }}
              >
                <Tab label="Description" value="1" />
                {selectedSubmission && (
                  <Tab label="Submission Notes" value="2" />
                )}
                <Tab label="Submissions" value="3" />
                {hasAnalyzed && <Tab label="Analysis" value="4" />}
              </TabList>
            </Toolbar>
          </AppBar>
          <TabPanel value="1">
            <ProblemDetail
              problem={problem}
              setRightTabValue={setRightTabValue}
            />
          </TabPanel>
          <TabPanel value="2">
            <SubmissionNoteCRUDListPage />
          </TabPanel>
          <TabPanel value="3">
            <SubmissionList
              submissions={submissions}
              simplified={true}
              //NOTE: this part is a little bit tricky
              rowClickCallback={(row: any) => {
                navigate(`/problems/${problemId}/submissions/${row.id}`);
              }}
            />
          </TabPanel>
          <TabPanel value="4">
            <ChatSubmissionAnalyzer
              loading={chatloading}
              chatResponse={chatResponse}
            />
          </TabPanel>
        </TabContext>
      </div>

      <div
        className="bg-dark w-50"
        style={{
          color: 'white',
          borderLeft: '2px solid darkorange',
        }}
      >
        <TabContext value={rightTabValue}>
          <AppBar position="sticky" sx={{ bgcolor: '#303030' }}>
            <Toolbar>
              <TabList
                onChange={handleRightTabChange}
                textColor="inherit"
                TabIndicatorProps={{ style: { background: '#fff' } }}
              >
                {submissions.length && <Tab label="Dashboard" value="6" />}
                <Tab label="Starred Notes" value="5" />
                <Tab label="New Submission" value="7" />
                {selectedSubmission && (
                  <Tab
                    label="Submission Detail"
                    value="8"
                    disabled={!selectedSubmission}
                  />
                )}
              </TabList>
            </Toolbar>
          </AppBar>
          <TabPanel
            value="5"
            sx={{
              height: 'calc(100vh - 170px)',
              overflowY: 'auto',
              padding: 2,
            }}
          >
            <NoteListPage notes={starredNotes} simplified={true} />
          </TabPanel>
          {submissions.length > 0 && (
            <TabPanel value="6">
              <div className="pt-3">
                <ProblemDashboard problem={problem} />
              </div>
            </TabPanel>
          )}
          <TabPanel value="7">
            <SubmissionFormInTab
              submissionData={submissionData}
              setSubmissionData={setSubmissionData}
              handleSubmit={handleSubmit}
              handleAnalyze={handleAnalyze}
              handleDateTimeChange={handleDateTimeChange}
              openner={Openner}
            />
          </TabPanel>
          <TabPanel value="8">
            <SubmissionDetailPage
              simplified={true}
              selectedSubmission={selectedSubmission}
              reloadSubmissions={refetch}
            />
          </TabPanel>
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

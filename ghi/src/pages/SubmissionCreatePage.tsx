import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import SubmissionForm from '../components/SubmissionForm';
import { dtToLocalISO16 } from '../utils/timeUtils';

// NOTE: Despite our GraphQL schema defining the query as 'problem_by_id',
// the server expects it in camelCase as 'problemById'.
const FETCH_PROBLEM = gql`
  query FetchProblem($id: Int!) {
    problemById(id: $id) {
      id
      title
      leetcodeNumber
    }
  }
`;

const FETCH_ALL_PROBLEMS = gql`
  query FetchAllProblems {
    allProblems {
      id
      title
      leetcodeNumber
    }
  }
`;

const CREATE_SUBMISSION = gql`
  mutation CreateSubmission($input: SubmissionMutationInput!) {
    updateSubmission(input: $input) {
      submission {
        code
        duration
        isSolution
        isWhiteboardMode
        isInterviewMode
        timeComplexity
        spaceComplexity
        problem {
          id
        }
        methods {
          name
        }
        proficiencyLevel
        submittedAt
      }
    }
  }
`;

const SubmissionCreatePage = () => {
  const { problemId } = useParams() as any;
  const navigate = useNavigate();

  const problemQueryResult = useQuery(FETCH_PROBLEM, {
    skip: !problemId,
    variables: { id: problemId ? +problemId : 0 },
  });

  const allProblemsQueryResult = useQuery(FETCH_ALL_PROBLEMS, {
    skip: !!problemId,
  });

  const {
    loading: singleProblemLoading,
    error: singleProblemError,
    data: problemData,
  } = problemQueryResult;
  const {
    loading: allProblemsLoading,
    error: allProblemsError,
    data: allProblemsData,
  } = allProblemsQueryResult;

  const showFixedProblemTitleInSelection = !!problemId;

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

  const [createSubmission] = useMutation(CREATE_SUBMISSION, {
    variables: {
      input: {
        ...data,
        duration: +data?.duration,
        submittedAt: new Date(data?.submittedAt + ':00'),
        timeComplexity: data?.timeComplexity,
        spaceComplexity: data?.spaceComplexity,
      },
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log('data', data);
    createSubmission().then((res) => {
      console.log('res', res);
    });
    showFixedProblemTitleInSelection
      ? navigate(`/problems/${problemId}/submissions`)
      : navigate(`/submissions`);
  };

  if (singleProblemLoading || allProblemsLoading) return <p>Loading...</p>;
  if (singleProblemError) return <p>Error: {singleProblemError.message}</p>;
  if (allProblemsError) return <p>Error: {allProblemsError.message}</p>;

  return (
    <SubmissionForm
      data={data}
      setData={setData}
      handleSubmit={handleSubmit}
      problemDetails={problemData?.problemById}
      allProblems={allProblemsData?.allProblems}
      showFixedProblemTitleInSelection={showFixedProblemTitleInSelection}
    />
  );
};

export default SubmissionCreatePage;

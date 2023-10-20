import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import NoteForm, { NoteType } from '../components/NoteForm';
import { toLocalTime, toUTC } from '../utils/timeUtils';

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

const CREATE_NOTE = gql`
  mutation CreateNote($input: ProblemNoteMutationInput!) {
    updateProblemNote(input: $input) {
      problemNote {
        problem {
          id
        }
        title
        content
        submittedAt
        isStarred
        noteType
        startLineNumber
        endLineNumber
      }
    }
  }
`;

const ProblemNoteCreatePage = () => {
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
    problem: problemId,
    title: '',
    content: '',
    submittedAt: toLocalTime(new Date()),
    isStarred: false,
    noteType: NoteType.ERR[0],
    startLineNumber: 0,
    endLineNumber: 0,
  });

  const [createNote] = useMutation(CREATE_NOTE, {
    variables: {
      input: {
        ...data,
        startLineNumber: +data?.startLineNumber,
        endLineNumber: +data?.endLineNumber,
        submittedAt: toUTC(new Date(data?.submittedAt + ':00')).toISOString(),
      },
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    createNote().then((res) => {
      console.log('res', res);
    });
    showFixedProblemTitleInSelection
      ? navigate(`/problems/${problemId}/notes`)
      : navigate(`/notes`);
  };

  if (singleProblemLoading || allProblemsLoading) return <p>Loading...</p>;
  if (singleProblemError) return <p>Error: {singleProblemError.message}</p>;
  if (allProblemsError) return <p>Error: {allProblemsError.message}</p>;

  return <NoteForm />;
};

export default ProblemNoteCreatePage;

import { gql } from '@apollo/client';

export const FETCH_PROBLEM = gql`
  query FetchProblem($id: Int!) {
    problemById(id: $id) {
      id
      title
      leetcodeNumber
    }
  }
`;

export const FETCH_ALL_PROBLEMS = gql`
  query FetchAllProblems {
    allProblems {
      id
      title
      leetcodeNumber
    }
  }
`;

export const CREATE_PROBLEM_NOTE = gql`
  mutation CreateNote($input: ProblemNoteMutationInput!) {
    updateProblemNote(input: $input) {
      problemNote {
        id
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

export const CREATE_SUBMISSION_NOTE = gql`
  mutation CreateSubmissionNote($input: SubmissionNoteMutationInput!) {
    updateSubmissionNote(input: $input) {
      submissionNote {
        id
        submission {
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

export const FETCH_SUBMISSION = gql`
  query FetchSubmission($id: Int!) {
    submissionById(id: $id) {
      id
      problem {
        id
        title
      }
      code
      proficiencyLevel
      passed
      submittedAt
      duration
      isSolution
      isInterviewMode
      isWhiteboardMode
      methods {
        id
        name
      }
    }
  }
`;

export const DELETE_NOTE = gql`
  mutation DeleteNote($id: ID!) {
    deleteNote(id: $id) {
      ok
    }
  }
`;

export const EDIT_PROBLEM_NOTE = gql`
  mutation UpdateProblemNote($input: ProblemNoteMutationInput!) {
    updateProblemNote(input: $input) {
      problemNote {
        id
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
        resources {
          id
          url
          resourceType
        }
      }
    }
  }
`;

export const EDIT_SUBMISSION_NOTE = gql`
  mutation UpdateSubmissionNote($input: SubmissionNoteMutationInput!) {
    updateSubmissionNote(input: $input) {
      submissionNote {
        id
        submission {
          id
        }
        title
        content
        submittedAt
        isStarred
        noteType
        startLineNumber
        endLineNumber
        resources {
          id
          url
          resourceType
        }
      }
    }
  }
`;

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

export const FETCH_ALL_NOTES = gql`
  query FETCH_ALL_NOTES {
    allNotes {
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
    }
  }
`;

export const CREATE_NOTE = gql`
  mutation CreateNote($input: NoteMutationInput!) {
    updateNote(input: $input) {
      note {
        id
        submission {
          id
        }
        title
        content
        submittedAt
        isStarred
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

export const EDIT_NOTE = gql`
  mutation UpdateNote($input: NoteMutationInput!) {
    updateNote(input: $input) {
      note {
        id
        submission {
          id
        }
        title
        content
        submittedAt
        isStarred
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

export const ALL_NOTES_BY_PROBLEM_ID = gql`
  query ProblemNotes($id: Int!) {
    problemById(id: $id) {
      id
      title
      leetcodeNumber

      submissions {
        id
        passed
        notes {
          submission {
            id
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
        }
      }
    }
  }
`;

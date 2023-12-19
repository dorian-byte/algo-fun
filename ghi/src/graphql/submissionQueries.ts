import { gql } from '@apollo/client';

// NOTE: Despite our GraphQL schema defining the query as 'problem_by_id',
// the server expects it in camelCase as 'problemById'.
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

export const CREATE_OR_UPDATE_SUBMISSION = gql`
  mutation CreateSubmission($input: SubmissionMutationInput!) {
    updateSubmission(input: $input) {
      submission {
        id
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

export const FETCH_SUBMISSION = gql`
  query FetchSubmission($id: Int!) {
    submissionById(id: $id) {
      id
      code
      proficiencyLevel
      passed
      submittedAt
      duration
      isSolution
      isInterviewMode
      isWhiteboardMode
      timeComplexity
      spaceComplexity
      methods {
        id
        name
      }
      problem {
        id
        leetcodeNumber
        title
      }
    }
  }
`;

export const DELETE_SUBMISSION = gql`
  mutation DeleteSubmission($id: ID!) {
    deleteSubmission(id: $id) {
      ok
    }
  }
`;

import { gql } from '@apollo/client';

export const NAV_GET_PROBLEM_NAME_VIA_SUBMISSION_ID = gql`
  query NavGetProblemNameWithSubmissionId($submissionId: ID!) {
    submissionById(id: $submissionId) {
      problem {
        id
        name
      }
    }
  }
`;

export const NAV_GET_PROBLEM_NAME_VIA_PROBLEM_ID = gql`
  query NavGetProblemNameWithProblemId($problemId: ID!) {
    problemById(id: $problemId) {
      id
      name
    }
  }
`;

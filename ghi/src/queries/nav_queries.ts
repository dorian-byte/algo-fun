import { gql } from '@apollo/client';

export const NAV_GET_PROBLEM_NAME_VIA_PROBLEM_ID = gql`
  query NavGetProblemNameWithProblemId($problemId: ID!) {
    problemById(id: $problemId) {
      id
      leetcodeNumber
      title
    }
  }
`;

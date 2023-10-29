import { useNavigate } from 'react-router-dom';
import { dtStrToLocalShortStr } from '../utils/timeUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChalkboard,
  faUserTie,
  faCheck,
  faTimes,
  faKey,
} from '@fortawesome/free-solid-svg-icons';

export interface Submission {
  id: string;
  problem: { id: string; leetcodeNumber: number; title: string };
  code: string;
  submittedAt: string;
  duration: string;
  isSolution: boolean;
  isWhiteboardMode: boolean;
  isInterviewMode: boolean;
  timeComplexity: Complexity;
  spaceComplexity: Complexity;
  methods: { name: string }[];
  proficiencyLevel: ProficiencyLevel;
  passed: boolean;
}

/* this has to match strictly with backend but just uppercased; its only use is to feed the "interface Submission" above */
type ProficiencyLevel =
  | 'NO_UNDERSTANDING'
  | 'CONCEPTUAL_UNDERSTANDING'
  | 'NO_PASS'
  | 'GUIDED_PASS'
  | 'UNSTEADY_PASS'
  | 'SMOOTH_PASS'
  | 'SMOOTH_OPTIMAL_PASS';

type Complexity =
  | 'O1'
  | 'NSQRT'
  | 'LOGN'
  | 'N'
  | 'NLOGN'
  | 'N2'
  | 'N3'
  | '2N'
  | 'NFACTORIAL'
  | 'A_2N';

export const PROFICIENCY_LEVEL_DISPLAY = {
  NO_UNDERSTANDING: 'No Understanding',
  CONCEPTUAL_UNDERSTANDING: 'Conceptual Understanding',
  NO_PASS: 'No Pass',
  GUIDED_PASS: 'Guided Pass',
  UNSTEADY_PASS: 'Unsteady Pass',
  SMOOTH_PASS: 'Smooth Pass',
  SMOOTH_OPTIMAL_PASS: 'Smooth Optimal Pass',
} as { [key: string]: string };

// export const BIG_O_COMPLEXITY_DISPLAY = {
//   O1: 'O(1)',
//   NSQRT: 'O(N^1/2)',
//   LOGN: 'O(logN)',
//   N: 'O(N)',
//   NLOGN: 'O(NlogN)',
//   N2: 'O(N^2)',
//   N3: 'O(N^3)',
//   '2N': 'O(2^N)',
//   NFACTORIAL: 'O(N!)',
// } as { [key: string]: string };

export const BIG_O_COMPLEXITY_DISPLAY = {
  O1: 'O(1)',
  NSQRT: 'O(N<sup>1/2</sup>)',
  LOGN: 'O(log N)',
  N: 'O(N)',
  NLOGN: 'O(N log N)',
  N2: 'O(N<sup>2</sup>)',
  N3: 'O(N<sup>3</sup>)',
  '2N': 'O(2<sup>N</sup>)',
  NFACTORIAL: 'O(N!)',
} as { [key: string]: string };

const SubmissionList = ({
  submissions,
  showProblem,
}: {
  submissions: Submission[];
  showProblem?: boolean;
}) => {
  const navigate = useNavigate();
  const sortedSubmissions = submissions.sort(
    (a: Submission, b: Submission) =>
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );

  // console.log('Submission data (sortedSubmissions):', sortedSubmissions);

  return (
    <div className="submission-list-wrapper">
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th className="text-gray"></th>
            {showProblem && <th className="text-gray">Problem</th>}
            <th className="text-gray">Status</th>
            <th className="text-gray">Submission Time</th>
            <th className="text-gray">Mins</th>
            <th className="text-gray">Proficiency Level</th>
            <th className="text-gray">O-Time</th>
            <th className="text-gray">O-Space</th>
            <th className="text-gray"></th>
            <th className="text-gray"></th>
          </tr>
        </thead>
        <tbody>
          {sortedSubmissions.map((sm: Submission) => (
            <tr key={sm?.id} onClick={() => navigate(`/submissions/${sm?.id}`)}>
              <td>
                {sm.isSolution && (
                  <FontAwesomeIcon
                    icon={faKey}
                    style={{ color: 'yellow', marginRight: '8px' }}
                  />
                )}
                {sm.isWhiteboardMode && (
                  <FontAwesomeIcon
                    icon={faChalkboard}
                    style={{ color: 'white', marginRight: '8px' }}
                  />
                )}
                {sm.isInterviewMode && (
                  <FontAwesomeIcon
                    icon={faUserTie}
                    style={{ color: 'skyblue' }}
                  />
                )}
              </td>
              {showProblem && (
                <td>
                  {sm?.problem?.leetcodeNumber}
                  {'. '}
                  {sm?.problem?.title}
                </td>
              )}
              <td>
                {sm.passed ? (
                  <FontAwesomeIcon
                    icon={faCheck}
                    style={{ color: 'lightgreen' }}
                  />
                ) : (
                  <FontAwesomeIcon icon={faTimes} style={{ color: 'red' }} />
                )}
              </td>
              <td>{dtStrToLocalShortStr(sm.submittedAt)}</td>
              <td>{sm.duration ? sm.duration + 'm' : ''}</td>
              <td>{PROFICIENCY_LEVEL_DISPLAY[sm.proficiencyLevel]}</td>
              {/* {BIG_O_COMPLEXITY_DISPLAY[sm.timeComplexity]} */}
              <td
                dangerouslySetInnerHTML={{
                  __html:
                    BIG_O_COMPLEXITY_DISPLAY[
                      sm.timeComplexity == 'A_2N' ? '2N' : sm.timeComplexity
                    ],
                }}
              ></td>
              <td
                dangerouslySetInnerHTML={{
                  __html:
                    BIG_O_COMPLEXITY_DISPLAY[
                      sm.spaceComplexity == 'A_2N' ? '2N' : sm.spaceComplexity
                    ],
                }}
              ></td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/submissions/${sm?.id}/notes`);
                  }}
                  className="btn btn-outline-primary btn-sm me-2"
                >
                  Notes
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/submissions/${sm?.id}/notes/new`);
                  }}
                  className="btn btn-outline-primary btn-sm"
                  style={{ height: 30, width: 30 }}
                >
                  +
                </button>
              </td>
              <td>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/submissions/${sm?.id}/resources`);
                  }}
                  className="btn btn-outline-info btn-sm me-2"
                >
                  Resources
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/submissions/${sm?.id}/resources/new`);
                  }}
                  className="btn btn-outline-info btn-sm"
                  style={{ height: 30, width: 30 }}
                >
                  +
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionList;

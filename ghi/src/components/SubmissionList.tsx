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
  methods: { name: string }[];
  proficiencyLevel: ProficiencyLevel;
  passed: boolean;
  timeComplexity: string;
  spaceComplexity: string;
}

type ProficiencyLevel =
  | 'NO_UNDERSTANDING'
  | 'CONCEPTUAL_UNDERSTANDING'
  | 'NO_PASS'
  | 'GUIDED_PASS'
  | 'UNSTEADY_PASS'
  | 'SMOOTH_PASS'
  | 'SMOOTH_OPTIMAL_PASS';

const PROFICIENCY_LEVEL_DISPLAY: Record<ProficiencyLevel, string> = {
  NO_UNDERSTANDING: 'No Understanding',
  CONCEPTUAL_UNDERSTANDING: 'Conceptual Understanding',
  NO_PASS: 'No Pass',
  GUIDED_PASS: 'Guided Pass',
  UNSTEADY_PASS: 'Unsteady Pass',
  SMOOTH_PASS: 'Smooth Pass',
  SMOOTH_OPTIMAL_PASS: 'Smooth Optimal Pass',
};

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
              <td>
                {PROFICIENCY_LEVEL_DISPLAY[sm.proficiencyLevel] || 'Unknown'}
              </td>
              <td>{sm.timeComplexity}</td>
              <td>{sm.spaceComplexity}</td>
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

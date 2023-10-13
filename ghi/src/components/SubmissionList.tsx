import { useNavigate } from 'react-router-dom';
import { formatTime } from '../utils/timeUtils';

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
    <table className="table table-dark table-striped">
      <thead>
        <tr>
          {showProblem && <th className="text-light-gray">Problem</th>}
          <th className="text-light-gray">Status</th>
          <th className="text-light-gray">Submission Time</th>
          <th className="text-light-gray">Time Used</th>
          <th className="text-light-gray">Proficiency Level</th>
          <th className="text-light-gray"></th>
          <th className="text-light-gray"></th>
        </tr>
      </thead>
      <tbody>
        {sortedSubmissions.map((sm: Submission) => (
          <tr key={sm?.id} onClick={() => navigate(`/submissions/${sm?.id}`)}>
            {showProblem && (
              <td>
                {sm?.problem?.leetcodeNumber} {sm?.problem?.title}
              </td>
            )}
            <td>{sm.passed ? '✅' : '❌'}</td>
            <td>{formatTime(sm.submittedAt)}</td>
            <td>{sm.duration ? sm.duration + 'm' : ''}</td>
            <td>
              {PROFICIENCY_LEVEL_DISPLAY[sm.proficiencyLevel] || 'Unknown'}
            </td>
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
  );
};

export default SubmissionList;

import { useNavigate } from 'react-router-dom';
import { formatTime } from '../utils/timeFormat';

export interface Submission {
  id: string;
  problem: { leetcodeNumber: number; title: string };
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
          {showProblem && <th>Problem</th>}
          <th>Status</th>
          <th>Submission Time</th>
          <th>Time Used</th>
          <th>Proficiency Level</th>
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
            <td>{sm.duration}</td>
            <td>
              {PROFICIENCY_LEVEL_DISPLAY[sm.proficiencyLevel] || 'Unknown'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SubmissionList;

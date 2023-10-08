import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import { formatTime } from '../utils/timeFormat';

const ALL_SUBMISSIONS = gql`
  query AllSubmissions {
    allSubmissions {
      id
      problem {
        leetcodeNumber
        title
      }
      code
      duration
      isSolution
      isWhiteboardMode
      isInterviewMode
      methods {
        name
      }
      proficiencyLevel
      submittedAt
    }
  }
`;

export interface Submission {
  id: string;
  problem: { leetcodeNumber: number; title: string };
  code: string;
  duration: string;
  isSolution: boolean;
  isWhiteboardMode: boolean;
  isInterviewMode: boolean;
  methods: { name: string }[];
  proficiencyLevel: ProficiencyLevel;
  submittedAt: string;
}

type ProficiencyLevel =
  | 'NO_UNDERSTANDING'
  | 'CONCEPTUAL_UNDERSTANDING'
  | 'NO_PASS'
  | 'GUIDED_PASS'
  | 'UNSTEADY_PASS'
  | 'SMOOTH_PASS'
  | 'SMOOTH_OPTIMAL_PASS';

// These keys match the actual values stored in the database for the proficiencyLevel field.
// Therefore, it's not NO_UNDERSTANDING, but no_understanding.
const PROFICIENCY_LEVEL_DISPLAY: Record<ProficiencyLevel, string> = {
  NO_UNDERSTANDING: 'No Understanding',
  CONCEPTUAL_UNDERSTANDING: 'Conceptual Understanding',
  NO_PASS: 'No Pass',
  GUIDED_PASS: 'Guided Pass',
  UNSTEADY_PASS: 'Unsteady Pass',
  SMOOTH_PASS: 'Smooth Pass',
  SMOOTH_OPTIMAL_PASS: 'Smooth Optimal Pass',
};

const SubmissionListPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(ALL_SUBMISSIONS);
  useEffect(() => {
    if (data) {
      console.log(data);
      setSubmissions(data.allSubmissions);
    }
  }, [data]);
  if (error) return <p>Error :( {error.message}</p>;
  if (loading) return <p>Loading...</p>;
  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-light">SubmissionListPage</h2>
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Problem</th>
            <th>Status</th>
            <th>Submission Time</th>
            <th>Time Used</th>
            <th>Proficiency Level</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((sm: Submission) => (
            <tr key={sm?.id} onClick={() => navigate(`/submissions/${sm?.id}`)}>
              <td>
                {sm?.problem?.leetcodeNumber} {sm?.problem?.title}
              </td>
              <td></td>
              <td>{formatTime(sm.submittedAt)}</td>
              <td>{sm.duration}</td>
              <td>
                {PROFICIENCY_LEVEL_DISPLAY[sm.proficiencyLevel] || 'Unknown'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionListPage;

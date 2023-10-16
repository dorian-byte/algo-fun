import { useNavigate } from 'react-router-dom';
import { hasPassed, allFailed } from '../utils/submissionStatusHelper';
import { difficultyColor } from '../utils/difficultyColorHelper';

const ProblemList = ({ problems }: { problems: any[] }) => {
  const navigate = useNavigate();

  return (
    <table className="table table-striped table-dark table-hover">
      <thead>
        <tr>
          <th className="text-gray">Status</th>
          <th className="text-gray">Title</th>
          <th className="text-gray">Difficulty</th>
          <th className="text-gray"></th>
          <th className="text-gray"></th>
          <th className="text-gray"></th>
        </tr>
      </thead>
      <tbody>
        {problems.map((pb: any) => (
          <tr key={pb?.id} onClick={() => navigate(`/problems/${pb?.id}`)}>
            <td>
              {hasPassed(pb?.submissions) ? (
                <span>✅</span>
              ) : allFailed(pb?.submissions) ? (
                <span>❌</span>
              ) : null}
            </td>
            <td>
              {pb.leetcodeNumber}
              {'. '} {pb.title}
            </td>
            <td style={{ color: difficultyColor(pb.difficulty) }}>
              {pb.difficulty.charAt(0) + pb.difficulty.slice(1).toLowerCase()}
            </td>
            <td>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/problems/${pb?.id}/submissions`);
                }}
                className="btn btn-outline-success btn-sm me-2"
              >
                Submissions
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/problems/${pb?.id}/submissions/new`);
                }}
                className="btn btn-outline-success btn-sm"
                style={{ height: 30, width: 30 }}
              >
                +
              </button>
            </td>
            <td>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/problems/${pb?.id}/notes`);
                }}
                className="btn btn-outline-primary btn-sm me-2"
              >
                Notes
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/problems/${pb?.id}/notes/new`);
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
                  navigate(`/problems/${pb?.id}/resources`);
                }}
                className="btn btn-outline-info btn-sm me-2"
              >
                Resources
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/problems/${pb?.id}/resources/new`);
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

export default ProblemList;

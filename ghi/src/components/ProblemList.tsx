import { useNavigate } from 'react-router-dom';
import { hasPassed, allFailed } from '../utils/submissionStatusHelper';
import { difficultyColor } from '../utils/difficultyColorHelper';

const ProblemList = ({ problems }: { problems: any[] }) => {
  const navigate = useNavigate();

  return (
    <table className="table table-striped table-dark table-hover">
      <thead>
        <tr>
          <th>Status</th>
          <th>Title</th>
          <th>Difficulty</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {problems.map((pb: any) => (
          <tr
            key={pb.id}
            onClick={() => {
              navigate(`/problems/${pb.id}`);
            }}
          >
            <td>
              {hasPassed(pb.submissions) ? (
                <span>✅</span>
              ) : allFailed(pb.submissions) ? (
                <span>❌</span>
              ) : null}
            </td>
            <td>
              {pb.leetcodeNumber}
              {'. '} {pb.title}
            </td>
            <td style={{ color: difficultyColor(pb.difficulty) }}>
              {pb.difficulty}
            </td>
            <td>
              <button className="btn btn-outline-primary btn-sm">Notes</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProblemList;

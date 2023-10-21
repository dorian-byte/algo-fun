import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hasPassed, allFailed } from '../utils/submissionStatusHelper';
import { difficultyColor } from '../utils/difficultyColorHelper';
import leetcode from '../assets/images/leetcode_icon.webp';

const ProblemList = ({ problems }: { problems: any[] }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(0);

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
          <tr
            key={pb?.id}
            onClick={() => navigate(`/problems/${pb?.id}`)}
            onMouseEnter={() => setHovered(pb?.id)}
            onMouseLeave={() => setHovered(0)}
          >
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
              {hovered == pb?.id && (
                <a href={pb?.url} target="blank" className="ms-2">
                  <img src={leetcode} alt="leetcode" height="20px" />
                </a>
              )}
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
                className={`btn ${
                  pb?.submissions?.length > 0
                    ? 'btn-outline-success'
                    : 'btn-success disabled'
                } btn-sm me-2`}
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
                className={`btn ${
                  pb?.notes?.length > 0
                    ? 'btn-outline-primary'
                    : 'btn-primary disabled'
                } btn-sm me-2`}
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
                className={`btn ${
                  pb?.resources?.length > 0
                    ? 'btn-outline-info'
                    : 'btn-info disabled'
                } btn-sm me-2`}
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

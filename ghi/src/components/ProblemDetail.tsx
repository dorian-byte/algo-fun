import { useNavigate } from 'react-router-dom';
import { Submission } from './SubmissionList';
import CodeEditor from './CodeEditor';

export interface Problem {
  id: string;
  leetcodeNumber: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  difficulty: string;
  timeComplexityRequirement: string;
  spaceComplexityRequirement: string;
  companies: { id: string; name: string }[];
  topics: { id: string; name: string }[];
  source: { id: string; name: string };
  url: string;
  askedByFaang: boolean;
  acceptanceRate: number;
  frequency: number;
  similarProblems: {
    id: string;
    title: string;
    url: string;
    difficulty: string;
  }[];
  submissions: Submission[];
  notes: any[];
}

const FrequencyBar = ({ frequency }: { frequency: number }) => {
  const segmentWidth = 7; // each segment is 7px wide
  const segments = Array.from({ length: 10 }, (_, i) => i + 1);
  const filledSegments = Math.ceil((frequency / 100) * 10);

  return (
    <div className="bar-container">
      {segments.map((_, index) => {
        const isFilled = index < filledSegments;
        const color = isFilled
          ? `rgb(255, ${255 - index * 25.5}, ${index * 25.5})`
          : '#ccc';
        return (
          <div
            key={index}
            className="bar-segment"
            style={{ width: `${segmentWidth}px`, backgroundColor: color }}
          ></div>
        );
      })}
    </div>
  );
};

const ProblemDetail = ({ problem }: { problem: Problem }) => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h4 className="mb-2">
          <b>
            {problem.leetcodeNumber}. {problem.title}
          </b>
        </h4>
        <div className="d-flex gap-3 align-items-center">
          <div className="badge badge-outlined border">
            {Math.round(problem.acceptanceRate)}% accepted
          </div>
          <FrequencyBar frequency={problem.frequency} />
        </div>
      </div>
      <div className="d-flex p-2 gap-2 mb-1">
        <div className="badge bg-success">{problem.difficulty}</div>
        {problem.askedByFaang && (
          <div className="badge bg-info text-dark">FANNG</div>
        )}
        <div className="badge bg-warning text-dark">Topics</div>
      </div>
      <CodeEditor
        height="40vh"
        value={problem.description}
        language="markdown"
        showLineNumbers={false}
        theme="vs-dark"
        readOnly={true}
      />
      <h5 className="mt-5 mb-3">Similar Questions</h5>
      <div className="d-flex gap-3 flex-wrap">
        {problem?.similarProblems?.map((p: any) => {
          const difficulty = p.difficulty.toLowerCase();
          const color =
            difficulty === 'easy'
              ? 'success'
              : difficulty === 'medium'
              ? 'orange'
              : 'danger';
          return (
            <div
              className={`badge badge-outlined bg-transparent text-${color} border border-${color}`}
              onClick={() => {
                navigate(`/problems/${p.id}`);
              }}
            >
              {p.title}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProblemDetail;

import { useEffect, useState } from 'react';
import { Problem } from './ProblemDetail';
import PerformanceOverTimeChart from './visualization/PerformanceOverTimeChart';
import DonutChart from './visualization/DonutChart';

const ProblemDashboard = ({ problem }: { problem: Problem }) => {
  const [recency, setRecency] = useState<number>(0);
  useEffect(() => {
    if (problem?.submissions) {
      const lastSubmittedDate = new Date(
        //NOTE: JSON.parse(JSON.stringify(...)) is used to deep copy the array
        JSON.parse(JSON.stringify(problem.submissions)).sort(
          (a: any, b: any) =>
            new Date(b.submittedAt as string).getTime() -
            new Date(a.submittedAt as string).getTime()
        )[0]?.submittedAt
      );
      const currentDate = new Date();
      const rccy = Math.floor(
        (currentDate.getTime() - lastSubmittedDate.getTime()) /
          (1000 * 3600 * 24)
      );
      setRecency(rccy);
    }
  }, [problem]);

  return (
    <div
      className="d-flex flex-column align-items-center gap-5 overflow-y-auto scrollbar-hidden"
      style={{
        maxHeight: 'calc(100vh - 15rem)',
      }}
    >
      <div
        className="hsl-transition-colors d-flex justify-content-center gap-5"
        style={{ fontSize: '1.5rem' }}
      >
        <div>
          <span style={{ fontSize: '3.5rem' }}>
            {(
              problem?.submissions?.reduce((acc, sub) => {
                const timeUsed = +sub?.duration || 0;
                return acc + timeUsed;
              }, 0) / problem?.submissions?.length || 1
            ).toFixed(0)}
          </span>{' '}
          mins
          <p>avg time spent</p>
        </div>
        <div>
          <span style={{ fontSize: '3.5rem' }}>
            {problem?.hasNotes ? problem?.notesCount : 0}
          </span>{' '}
          notes
          <p>
            {problem?.submissions?.reduce((acc, curr: any) => {
              return acc + curr?.notes?.filter((n) => n.isStarred).length || 0;
            }, 0)}
            &nbsp;starred
          </p>
        </div>
        <div>
          <span style={{ fontSize: '3.5rem' }}>{recency}</span> days
          <p>since last submission</p>
        </div>
      </div>
      <DonutChart submissions={problem?.submissions || []} />
      <div>
        <PerformanceOverTimeChart submissions={problem?.submissions || []} />
      </div>
    </div>
  );
};

export default ProblemDashboard;

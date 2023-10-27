import { useEffect, useState } from 'react';

const Timer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [seconds, setSeconds] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);

  let interval: NodeJS.Timeout;
  useEffect(() => {
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((sec) => sec + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive]);

  const parseSeconds = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${hours > 0 ? (hours < 10 ? `0${hours}:` : `${hours}:`) : ''}${
      minutes < 10 ? `0${minutes}` : `${minutes}`
    }:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  if (location.pathname !== '/submissions/new') return null;

  return (
    <div
      className="d-flex flex-row align-items-center"
      style={{ marginTop: '-1rem' }}
    >
      <div
        className="btn"
        onClick={() => setIsExpanded((prevState) => !prevState)}
        style={{ fontSize: '1.35rem' }}
      >
        ⏳
      </div>
      {isExpanded && (
        <div>
          <div className="btn text-light">{parseSeconds(seconds)}</div>
          <div
            className="btn"
            onClick={() => {
              setSeconds(0);
            }}
          >
            🔁
          </div>
          <div
            className="btn"
            onClick={() => setIsActive((prevState) => !prevState)}
          >
            {isActive ? '⏸️' : '▶️'}
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;

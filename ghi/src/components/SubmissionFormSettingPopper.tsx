import * as React from 'react';
import dayjs from 'dayjs';
import Popper, { PopperPlacementType } from '@mui/material/Popper';
import { ClickAwayListener, InputBase, List, ListItem } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

interface SimplifiedSubmissionFormProps {
  submissionData?: any;
  popperTitle?: string;
  position?: PopperPlacementType | undefined;
  proficiencyLevel: string;
  setProficiencyLevel: React.Dispatch<React.SetStateAction<string>>;
  timeComplexity: string;
  setTimeComplexity: React.Dispatch<React.SetStateAction<string>>;
  spaceComplexity: string;
  setSpaceComplexity: React.Dispatch<React.SetStateAction<string>>;
  isSolution: boolean;
  setIsSolution: React.Dispatch<React.SetStateAction<boolean>>;
  submittedAt: Date;
  setSubmittedAt: React.Dispatch<React.SetStateAction<Date>>;
  duration: number;
  setDuration: React.Dispatch<React.SetStateAction<number>>;
  isWhiteboardMode: boolean;
  setIsWhiteboardMode: React.Dispatch<React.SetStateAction<boolean>>;
  isInterviewMode: boolean;
  setIsInterviewMode: React.Dispatch<React.SetStateAction<boolean>>;
  complexityOptions: string[];
  proficiencyLevelOptions: string[];
  handleSubmit: (e) => void;
}

export default function SubmissionFormSettingPopper({
  submissionData,
  popperTitle,
  position,
  proficiencyLevel,
  setProficiencyLevel,
  timeComplexity,
  setTimeComplexity,
  spaceComplexity,
  setSpaceComplexity,
  isSolution,
  setIsSolution,
  submittedAt,
  setSubmittedAt,
  duration,
  setDuration,
  isWhiteboardMode,
  setIsWhiteboardMode,
  isInterviewMode,
  setIsInterviewMode,
  complexityOptions = [],
  proficiencyLevelOptions = [],
  handleSubmit,
}: SimplifiedSubmissionFormProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [proficiencyAnchor, setProficiencyAnchor] =
    React.useState<null | HTMLElement>(null);

  const [timeComplexityAnchor, setTimeComplexityAnchor] =
    React.useState<null | HTMLElement>(null);

  const [spaceComplexityAnchor, setSpaceComplexityAnchor] =
    React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  React.useEffect(() => {
    if (!anchorEl) {
      setProficiencyAnchor(null);
      setTimeComplexityAnchor(null);
      setSpaceComplexityAnchor(null);
    }
  }, [anchorEl]);

  const id = Boolean(anchorEl) ? 'popper-more-info' : undefined;

  const chipData = {
    'O-time': {
      options: complexityOptions,
      anchor: timeComplexityAnchor,
      setAnchor: setTimeComplexityAnchor,
      label: timeComplexity,
      closeOthers: () => {
        setSpaceComplexityAnchor(null);
        setProficiencyAnchor(null);
      },
      setLabel: setTimeComplexity,
    },
    'O-space': {
      options: complexityOptions,
      anchor: spaceComplexityAnchor,
      setAnchor: setSpaceComplexityAnchor,
      label: spaceComplexity,
      closeOthers: () => {
        setTimeComplexityAnchor(null);
        setProficiencyAnchor(null);
      },
      setLabel: setSpaceComplexity,
    },
    Proficiency: {
      options: proficiencyLevelOptions,
      anchor: proficiencyAnchor,
      setAnchor: setProficiencyAnchor,
      label: proficiencyLevel,
      closeOthers: () => {
        setTimeComplexityAnchor(null);
        setSpaceComplexityAnchor(null);
      },
      setLabel: setProficiencyLevel,
    },
  } as {
    [key: string]: {
      options: string[];
      anchor: any;
      setAnchor: any;
      label: string;
      closeOthers: any;
      setLabel: any;
    };
  };

  return (
    <div>
      <button
        aria-describedby={id}
        type="button"
        onClick={handleClick}
        className="btn btn-primary mt-2"
      >
        {popperTitle || 'more +'}
      </button>
      <Popper
        id={id}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        placement={position ? position : 'bottom-end'}
      >
        <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
          <div
            className="d-flex flex-column gap-2 bg-gray p-2 rounded-3"
            style={{
              maxWidth: 'fit-content',
              maxHeight: 'fit-content',
            }}
          >
            <div className="d-flex justify-content-between">
              <DateTimePicker
                value={dayjs(submittedAt)}
                label="submitted at"
                onChange={(newValue) => {
                  setSubmittedAt(newValue as any);
                }}
              />
              <div
                className="d-flex gap-2 justify-content-between align-items-center"
                style={{
                  cursor: 'pointer',
                  userSelect: 'none',
                }}
              >
                {renderBadges([
                  ['solution', isSolution, setIsSolution],
                  ['whiteboard', isWhiteboardMode, setIsWhiteboardMode],
                  ['interview', isInterviewMode, setIsInterviewMode],
                ])}
              </div>
            </div>
            <div className="d-flex">
              <div className="badge badge-outlined text-true border border-true d-flex align-items-center">
                <div className="d-flex align-items-center justify-content-center">
                  Used
                  <InputBase
                    inputProps={{ min: 0, style: { textAlign: 'center' } }}
                    sx={{ width: 50, ml: 0.5, height: 20 }}
                    value={duration}
                    type="number"
                    onChange={(e) => {
                      setDuration(+e.target.value as number);
                    }}
                  />
                  min
                </div>
              </div>
              {Object.keys(chipData).map((objKey: string) => {
                return (
                  <div
                    className="d-flex justify-content-center align-items-center ms-1"
                    key={objKey}
                  >
                    {renderChip({
                      labelPrefix: objKey,
                      ...chipData[objKey],
                    })}
                  </div>
                );
              })}
            </div>
            <button
              className="btn btn-outline-primary"
              onClick={(e) => {
                handleSubmit(e);
                setAnchorEl(null);
              }}
            >
              submit
            </button>
          </div>
        </ClickAwayListener>
      </Popper>
    </div>
  );
}

const chipMinWidth = {
  'O-time': 130,
  'O-space': 140,
  Proficiency: 190,
} as {
  [key: string]: number;
};

const renderChip = ({
  labelPrefix,
  label,
  anchor,
  setAnchor,
  closeOthers,
  options,
  setLabel,
}: {
  labelPrefix: string;
  label: string;
  anchor: any;
  setAnchor: any;
  closeOthers: any;
  options: any;
  setLabel: any;
}): React.ReactElement => {
  return (
    <>
      <div
        className="badge badge-outlined text-true border border-true user-select-none d-flex align-items-center"
        role="button"
        style={{ height: 30, width: chipMinWidth[labelPrefix] }}
        onClick={(e) => {
          setAnchor(anchor ? null : e.currentTarget);
          closeOthers();
        }}
      >
        {`${labelPrefix}: ${label}`}
      </div>
      <Popper
        id={'popper-' + labelPrefix}
        open={Boolean(anchor)}
        anchorEl={anchor}
        placement={'right-start'}
      >
        <ClickAwayListener onClickAway={() => setAnchor(null)}>
          <List sx={{ bgcolor: 'black', borderRadius: 2 }}>
            {options.map((level: any) => {
              return (
                <ListItem
                  key={level}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => {
                    setLabel(level);
                    setAnchor(null);
                  }}
                >
                  {level}
                </ListItem>
              );
            })}
          </List>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

const renderBadges = (arr: string[] | any[]) => {
  return arr.map(([label, value, setValue]) => {
    return (
      <div
        className={`badge badge-outlined text-${
          value ? 'true' : 'false'
        } border border-${value ? 'true' : 'false'}`}
        style={{ width: 100 }}
        onClick={() => setValue((prev: boolean) => !prev)}
      >
        {label} <FontAwesomeIcon icon={value ? faCheck : faTimes} />
      </div>
    );
  });
};

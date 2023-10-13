import { useCallback, useEffect, useRef, useState } from 'react';
import CodeEditor from './CodeEditor';
import { Typeahead } from 'react-bootstrap-typeahead';

export const NoteType = {
  INTUITION: ['intuition', 'intuition'],
  STUCK_POINT: ['stuck_point', 'stuck point'],
  QNA: ['qna', 'Q&A'],
  ERR: ['err', 'error'],
  MEMO: ['memo', 'memo'],
};

interface Props {
  data: any;
  setData: (data: any) => void;
  handleSubmit: (e: any) => void;
  problemDetails: {
    id: string;
    leetcodeNumber: number;
    title: string;
  };
  showFixedProblemTitleInSelection?: boolean;
  allProblems?: any[];
}

const NoteForm: React.FC<Props> = ({
  data,
  setData,
  handleSubmit,
  problemDetails,
  showFixedProblemTitleInSelection,
  allProblems,
}) => {
  const handleDateTimeChange = (type: 'date' | 'time', value: string) => {
    const [currentDate, currentTime] = data?.submittedAt?.split('T');
    const newDateTime =
      type === 'date' ? `${value}T${currentTime}` : `${currentDate}T${value}`;
    setData((prev: any) => ({ ...prev, submittedAt: newDateTime }));
  };

  const [codeBlockHeight, setCodeBlockHeight] = useState(0);
  const parentRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState<any[]>([
    allProblems && allProblems.length > 0
      ? { id: '', leetcodeNumber: '', title: '' }
      : problemDetails,
  ]);
  const [options, setOptions] = useState<any[]>(
    allProblems && allProblems.length > 0 ? allProblems : [problemDetails]
  );
  useEffect(() => {
    if (parentRef?.current?.clientHeight) {
      console.log('parentRef height', parentRef?.current?.clientHeight);
      setCodeBlockHeight(parentRef?.current?.clientHeight);
    }
  }, [parentRef]);
  const handleSelectionChange = useCallback((selectedProblem: any) => {
    const selectedId = selectedProblem[0] ? selectedProblem[0].id : null;
    setData((prev: any) => ({
      ...prev,
      problem: selectedId,
    }));
    setSelected(selectedProblem || []);
  }, []);
  useEffect(() => {
    if (allProblems && Array.isArray(allProblems)) {
      setOptions(allProblems);
    }
    if (problemDetails && typeof problemDetails === 'object') {
      setSelected([problemDetails]);
    }
  }, [allProblems, problemDetails]);

  return (
    <div className="container mt-5 overflow-y-auto" ref={parentRef}>
      <form className="d-flex flex-row gap-5" onSubmit={handleSubmit}>
        <div className="d-flex flex-column gap-2 flex-fill">
          <h3 className="headline mb-2">New Note</h3>
          <div className="form-group col-md-12 mb-2">
            <label className="mb-2">
              {showFixedProblemTitleInSelection ? 'Problem' : 'Select Problem'}
              {!showFixedProblemTitleInSelection && (
                <span className="required-asterisk" aria-hidden="true">
                  {' '}
                  *
                </span>
              )}
            </label>
            <Typeahead
              className="form-control"
              id="select-problem-typeahead"
              labelKey={(option: any) =>
                `${option?.leetcodeNumber} ${option?.title}`
              }
              selected={selected}
              options={options}
              disabled={showFixedProblemTitleInSelection}
              renderInput={(props) => {
                const { inputRef, referenceElementRef, ...inputProps } = props;
                return (
                  <input
                    id="select-problem-inside-typeahead"
                    {...inputProps}
                    style={{
                      backgroundColor: 'transparent !important',
                    }}
                  />
                );
              }}
              placeholder="Choose a LeetCode problem..."
              onChange={handleSelectionChange}
              renderMenuItemChildren={(option: any) => (
                <div>
                  {option?.leetcodeNumber} - {option?.title}
                </div>
              )}
            />
          </div>

          <div className="form-group mb-2">
            <label className="mb-2">Title</label>
            <input
              className="form-control"
              type="text"
              value={data?.title}
              onChange={(e) =>
                setData((prev: any) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div className="form-group mb-2">
            <label className="mb-2">Content</label>
            <span className="required-asterisk" aria-hidden="true">
              {' '}
              *
            </span>
            <textarea
              className="form-control"
              value={data?.content}
              onChange={(e) =>
                setData((prev: any) => ({ ...prev, content: e.target.value }))
              }
              required
            />
          </div>

          <div className="form-group mb-2">
            <label className="mb-2">Note Type</label>
            <select
              className="form-control"
              value={data?.noteType}
              onChange={(e) => {
                setData((prev: any) => ({
                  ...prev,
                  noteType: e.target.value,
                }));
              }}
            >
              {Object.values(NoteType).map((level) => (
                <option key={level[0]} value={level[0]}>
                  {level[1]}
                </option>
              ))}
            </select>
          </div>

          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="isStarred"
              checked={data?.isStarred}
              onChange={(e) =>
                setData((prev: any) => ({
                  ...prev,
                  isStarred: e.target.checked,
                }))
              }
            />
            <label className="form-check-label" htmlFor="isStarred">
              Star this note
            </label>
          </div>

          <div className="form-group col-md-6">
            <label className="mb-2">Submitted At</label>
            <input
              className="form-control mb-2"
              type="date"
              value={data?.submittedAt.split('T')[0]}
              onChange={(e) => handleDateTimeChange('date', e.target.value)}
            />
            <input
              className="form-control"
              type="time"
              value={data?.submittedAt.split('T')[1]}
              onChange={(e) => handleDateTimeChange('time', e.target.value)}
            />
          </div>

          <div className="form-row mt-2 mb-2">
            <div className="form-group col-md-6">
              <label className="mb-2">Line start:</label>
              <input
                className="form-control"
                type="number"
                value={data?.startLineNumber}
                onChange={(e) =>
                  setData((prev: any) => ({
                    ...prev,
                    startLineNumber: e.target.value,
                  }))
                }
                min="0"
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  if (Number(input.value) < 0) input.value = '0';
                }}
              />
            </div>
            <div className="form-group col-md-6">
              <label className="mb-2">end:</label>
              <input
                className="form-control"
                type="number"
                value={data?.endLineNumber}
                onChange={(e) =>
                  setData((prev: any) => ({
                    ...prev,
                    endLineNumber: e.target.value,
                  }))
                }
                min="0"
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  if (Number(input.value) < 0) input.value = '0';
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-outline-primary mt-3 mb-5">
            Submit
          </button>
        </div>

        <CodeEditor
          width="50%"
          height={codeBlockHeight + 'px'}
          placeholder="Enter your code here..."
          language="python"
          value={data?.code}
          showLineNumbers={true}
          theme="vs-dark"
          readOnly={false}
          onChange={(value: string) => {
            setData((prev: any) => ({ ...prev, code: value }));
          }}
        />
      </form>
    </div>
  );
};

export default NoteForm;

import { Typeahead } from 'react-bootstrap-typeahead';
const NoteFormTypeAhead = ({
  selected,
  options,
  problemId,
  submissionId,
  handleSelectionChange,
}: {
  selected: any[];
  options: any[];
  problemId: string | undefined;
  submissionId: string | undefined;
  handleSelectionChange: (selected: any[]) => void;
}) => {
  return (
    <Typeahead
      className="form-control"
      id="select-problem-typeahead"
      labelKey={(option: any) => `${option?.leetcodeNumber} ${option?.title}`}
      selected={selected}
      options={options}
      disabled={!!problemId || !!submissionId}
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
  );
};

export default NoteFormTypeAhead;

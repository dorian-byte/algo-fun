import React from 'react';
import { BIG_O_COMPLEXITY_DISPLAY } from './SubmissionList';
import ChatMethodGenerator from './ChatMethodGenerator';
import { PROFICIENCY_LEVEL_DISPLAY } from './SubmissionList';
import Timer from './Timer';
import FormDrawer from './DrawerWrapper';
import CodeEditor from './CodeEditor';

const SubmissionFormInTab = ({
  submissionData,
  setSubmissionData,
  handleSubmit,
  handleAnalyze,
  handleDateTimeChange,
  openner: Openner,
}: any) => {
  const [opacity, setOpacity] = React.useState(0.3);
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center position-relative">
        <div
          className="d-flex align-items-center gap-2 position-absolute"
          style={{
            zIndex: 9,
            right: 5,
            top: -25,
            opacity,
          }}
          onMouseEnter={() => setOpacity(1)}
          onMouseLeave={() => setOpacity(0.3)}
        >
          <Timer />
          <div>
            <FormDrawer
              width={'400px'}
              renderOpenner={(cb) => <Openner cb={cb} />}
            >
              <form className="d-flex flex-row gap-5" onSubmit={handleSubmit}>
                <div className="d-flex flex-column gap-5">
                  <div className="form-floating">
                    <select
                      className="form-control"
                      value={submissionData?.proficiencyLevel}
                      onChange={(e) => {
                        setSubmissionData((prev: any) => ({
                          ...prev,
                          proficiencyLevel: e.target.value,
                        }));
                      }}
                    >
                      <option value="" disabled></option>
                      {Object.keys(PROFICIENCY_LEVEL_DISPLAY).map((level) => (
                        <option key={level} value={level.toLowerCase()}>
                          {PROFICIENCY_LEVEL_DISPLAY[level]}
                        </option>
                      ))}
                    </select>
                    <label>
                      Proficiency Level
                      <span className="required-asterisk"> *</span>
                    </label>
                  </div>

                  <div className="d-flex flex-row gap-3">
                    <div className="form-floating">
                      <select
                        id="o-time"
                        // className="form-select"
                        className="form-control"
                        value={submissionData?.timeComplexity}
                        onChange={(e) => {
                          setSubmissionData((prev: any) => ({
                            ...prev,
                            timeComplexity: e.target.value,
                          }));
                        }}
                      >
                        <option value="" selected>
                          {/* <option value="" disabled> */}
                        </option>
                        {Object.keys(BIG_O_COMPLEXITY_DISPLAY).map((level) => (
                          <option
                            key={level}
                            value={level.toLowerCase()}
                            dangerouslySetInnerHTML={{
                              __html: BIG_O_COMPLEXITY_DISPLAY[level] as string,
                            }}
                          ></option>
                        ))}
                      </select>
                      <label htmlFor="o-time">
                        Time <span className="required-asterisk"> *</span>
                      </label>
                    </div>

                    <div className="form-floating">
                      <select
                        id="o-space"
                        className="form-control"
                        value={submissionData?.spaceComplexity}
                        onChange={(e) => {
                          setSubmissionData((prev: any) => ({
                            ...prev,
                            spaceComplexity: e.target.value,
                          }));
                        }}
                      >
                        <option value="" selected></option>
                        {Object.keys(BIG_O_COMPLEXITY_DISPLAY).map((level) => (
                          <option
                            key={level}
                            value={level.toLowerCase()}
                            dangerouslySetInnerHTML={{
                              __html: BIG_O_COMPLEXITY_DISPLAY[level] as string,
                            }}
                          ></option>
                        ))}
                      </select>
                      <label htmlFor="o-space">Space</label>
                    </div>
                  </div>

                  <div className="d-flex flex-row mt-3 justify-content-between">
                    <div className="form-group flex-fill">
                      <label className="text-gray small mb-1">
                        Submitted At
                      </label>
                      <div className="d-flex flex-row">
                        <input
                          className="form-control"
                          type="date"
                          value={submissionData?.submittedAt.split('T')[0]}
                          onChange={(e) =>
                            handleDateTimeChange('date', e.target.value)
                          }
                        />
                        <input
                          className="form-control ms-2"
                          type="time"
                          value={submissionData?.submittedAt.split('T')[1]}
                          onChange={(e) =>
                            handleDateTimeChange('time', e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="text-gray small mb-1">
                          Mins Used
                        </label>
                        <input
                          className="form-control"
                          type="number"
                          value={submissionData?.duration}
                          placeholder="Mins Used"
                          onChange={(e) =>
                            setSubmissionData((prev: any) => ({
                              ...prev,
                              duration: e.target.value,
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
                  </div>

                  <div className="mt-3">
                    <div className="d-flex flex-column gap-1 ">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isSolutionSwitch"
                          checked={submissionData?.isSolution}
                          onChange={(e) =>
                            setSubmissionData((prev: any) => ({
                              ...prev,
                              isSolution: e.target.checked,
                            }))
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="isSolutionSwitch"
                        >
                          Best Solution
                        </label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isWhiteboardModeSwitch"
                          checked={submissionData?.isWhiteboardMode}
                          onChange={(e) =>
                            setSubmissionData((prev: any) => ({
                              ...prev,
                              isWhiteboardMode: e.target.checked,
                            }))
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="isWhiteboardModeSwitch"
                        >
                          Whiteboard Mode
                        </label>
                      </div>
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="isInterviewModeSwitch"
                          checked={submissionData?.isInterviewMode}
                          onChange={(e) =>
                            setSubmissionData((prev: any) => ({
                              ...prev,
                              isInterviewMode: e.target.checked,
                            }))
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="isInterviewModeSwitch"
                        >
                          Interview Mode
                        </label>
                      </div>
                    </div>
                  </div>
                  <ChatMethodGenerator
                    data={submissionData}
                    setData={setSubmissionData}
                  />

                  {/* <button
                    type="submit"
                    className="btn btn-outline-primary mt-4 mb-5"
                  >
                    Submit
                  </button> */}
                </div>
              </form>
            </FormDrawer>
          </div>
        </div>
      </div>
      <CodeEditor
        width="100%"
        height="59vh"
        value={submissionData.code}
        language="python"
        showLineNumbers={false}
        theme="vs-dark"
        readOnly={false}
        onChange={(value) => {
          setSubmissionData((prev: any) => ({ ...prev, code: value }));
          setOpacity(0.3);
        }}
      />
      <div className="w-100 d-flex gap-4 mt-2">
        <button
          disabled={!submissionData.code}
          onClick={handleAnalyze}
          className="btn btn-outline-success w-75"
        >
          Analyze
        </button>
        <button
          disabled={!submissionData.code}
          onClick={handleSubmit}
          className="btn btn-outline-primary w-75"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default SubmissionFormInTab;

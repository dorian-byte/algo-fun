import { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { dtStrToLocalShortStr } from '../utils/timeUtils';
import CodeEditor from '../components/CodeEditor';
import Drawer from '../components/DrawerWrapper';
import NoteForm from '../components/NoteForm';

const SUMBISSION_BY_ID = gql`
  query SubmissionById($id: Int!) {
    submissionById(id: $id) {
      id
      problem {
        id
        title
      }
      code
      proficiencyLevel
      passed
      submittedAt
      duration
      isSolution
      isInterviewMode
      isWhiteboardMode
      timeComplexity
      spaceComplexity
      methods {
        id
        name
      }
    }
  }
`;

const SubmissionDetailPage = () => {
  const { submissionId } = useParams();
  const [submission, setSubmission] = useState({
    id: '',
    code: '',
    problem: { title: '' },
  }) as any;
  const { data } = useQuery(SUMBISSION_BY_ID, {
    variables: { id: submissionId ? +submissionId : 0 },
  });
  useEffect(() => {
    if (data) {
      setSubmission(data.submissionById);
    }
  }, [data]);

  return (
    <div className="container mt-5 overflow-y-auto">
      <form className="d-flex flex-row gap-5">
        <div className="d-flex flex-column gap-2 flex-fill">
          <h3 className="page-header">New Submission</h3>
          <div className="form-floating mt-3">
            <label>Problem</label>
          </div>

          <div className="d-flex flex-row justify-content-between gap-5 mt-4">
            <div className="form-floating flex-fill">
              {/* <select
                className="form-control"
                value={data?.proficiencyLevel}
                onChange={(e) => {
                  setData((prev: any) => ({
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
              </select> */}
              <label>
                Proficiency Level
                <span className="required-asterisk"> *</span>
              </label>
            </div>

            <div className="d-flex flex-row gap-3">
              <div className="form-floating">
                {/* <select
                  id="o-time"
                  className="form-control"
                  value={data?.timeComplexity}
                  onChange={(e) => {
                    setData((prev: any) => ({
                      ...prev,
                      timeComplexity: e.target.value,
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
                </select> */}
                <label htmlFor="o-time">
                  Time <span className="required-asterisk"> *</span>
                </label>
              </div>

              <div className="form-floating">
                {/* <select
                  id="o-space"
                  className="form-control"
                  value={data?.spaceComplexity}
                  onChange={(e) => {
                    setData((prev: any) => ({
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
                </select> */}
                <label htmlFor="o-space">Space</label>
              </div>
            </div>
          </div>

          <div className="d-flex flex-row mt-3 justify-content-between">
            <div className="form-group flex-fill">
              <label className="text-gray small mb-1">Submitted At</label>
              {/* <div className="d-flex flex-row">
                <input
                  className="form-control"
                  type="date"
                  value={data?.submittedAt.split('T')[0]}
                  onChange={(e) => handleDateTimeChange('date', e.target.value)}
                />
                <input
                  className="form-control ms-2"
                  type="time"
                  value={data?.submittedAt.split('T')[1]}
                  onChange={(e) => handleDateTimeChange('time', e.target.value)}
                />
              </div> */}
            </div>

            <div className="form-group ms-5">
              <label className="text-gray small mb-1">Mins Used</label>
              {/* <input
                className="form-control"
                type="number"
                value={data?.duration}
                placeholder="Mins Used"
                onChange={(e) =>
                  setData((prev: any) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                min="0"
                onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  if (Number(input.value) < 0) input.value = '0';
                }}
              /> */}
            </div>
          </div>

          <div className="d-flex mt-3">
            <div className="form-group" style={{ width: '40%' }}>
              <label className="text-gray small mb-1">Methods</label>
              {/* <select
              multiple
              className="form-control"
              value={data?.methods}
              onChange={(e) => {
                const selectedOptions = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );
                setData((prev: any) => ({
                  ...prev,
                  methods: selectedOptions,
                }));
              }}
            >
              {['method1', 'method2', 'method3'].map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select> */}
            </div>

            <div className="d-flex flex-column gap-1 mt-2">
              <div className="form-check form-switch">
                {/* <input
                  className="form-check-input"
                  type="checkbox"
                  id="isSolutionSwitch"
                  checked={data?.isSolution}
                  onChange={(e) =>
                    setData((prev: any) => ({
                      ...prev,
                      isSolution: e.target.checked,
                    }))
                  }
                /> */}
                <label className="form-check-label" htmlFor="isSolutionSwitch">
                  Best Solution
                </label>
              </div>
              <div className="form-check form-switch">
                {/* <input
                  className="form-check-input"
                  type="checkbox"
                  id="isWhiteboardModeSwitch"
                  checked={data?.isWhiteboardMode}
                  onChange={(e) =>
                    setData((prev: any) => ({
                      ...prev,
                      isWhiteboardMode: e.target.checked,
                    }))
                  }
                /> */}
                <label
                  className="form-check-label"
                  htmlFor="isWhiteboardModeSwitch"
                >
                  Whiteboard Mode
                </label>
              </div>
              <div className="form-check form-switch">
                {/* <input
                  className="form-check-input"
                  type="checkbox"
                  id="isInterviewModeSwitch"
                  checked={data?.isInterviewMode}
                  onChange={(e) =>
                    setData((prev: any) => ({
                      ...prev,
                      isInterviewMode: e.target.checked,
                    }))
                  }
                /> */}
                <label
                  className="form-check-label"
                  htmlFor="isInterviewModeSwitch"
                >
                  Interview Mode
                </label>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-outline-primary mt-4 mb-5">
            Submit
          </button>
        </div>

        <div className="d-flex flex-column flex-fill">
          <label className="text-gray">Code</label>
          <CodeEditor
            value={submission.code}
            language="python"
            showLineNumbers={true}
            theme="vs-dark"
            readOnly={true}
          />
        </div>
      </form>
    </div>
    // <Drawer buttonText="add note">
    //   <NoteForm inDrawer={true} />
    // </Drawer>
    // <div className="card-text">
    //   <CodeEditor
    //     value={submission.code}
    //     language="python"
    //     showLineNumbers={true}
    //     theme="vs-dark"
    //     readOnly={true}
    //   />
    // </div>
  );
};

export default SubmissionDetailPage;

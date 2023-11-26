import { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { dtStrToLocalShortStr } from '../utils/timeUtils';
import { VideoCard, ImageCard } from './Cards';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faStar } from '@fortawesome/free-solid-svg-icons';
import ConfirmationDialog from './ConfirmationDialog';
import { useMutation } from '@apollo/client';
import {
  DELETE_NOTE,
  EDIT_PROBLEM_NOTE,
  EDIT_SUBMISSION_NOTE,
} from '../graphql/noteQueries';

interface NoteDetailAccordionProps {
  note: Note;
  allOpen: boolean;
  noteLevel: 'submission' | 'problem';
  parentId: number | string;
  refresh?: () => void;
}

const NoteDetailAccordion: React.FC<NoteDetailAccordionProps> = ({
  note: nt,
  allOpen,
  noteLevel,
  parentId,
  refresh,
}) => {
  const [open, setOpen] = useState(allOpen);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteNote] = useMutation(DELETE_NOTE, {
    variables: { id: nt?.id },
  });
  const [updateProblemNote] = useMutation(EDIT_PROBLEM_NOTE);
  const [updateSubmissionNote] = useMutation(EDIT_SUBMISSION_NOTE);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [editable, setEditable] = useState(false);
  const [note, setNote] = useState(nt as Note);

  const handleConfirmDelete = () => {
    deleteNote().then((res) => {
      if (res.data.deleteNote?.ok) {
        console.log('res', res);
        setIsDeleteDialogOpen(false);
        // window.location.reload();
        refresh && refresh();
      }
    });
  };

  const handleSubmitEdit = () => {
    const input = {
      id: note?.id,
      title: note?.title,
      content: note?.content,
      isStarred: note?.isStarred,
      noteType: note?.noteType.toLowerCase(),
      submittedAt: new Date().toISOString(),
    } as any;
    if (noteLevel === 'submission') {
      input['submission'] = parentId;
    } else if (noteLevel === 'problem') {
      input['problem'] = parentId;
    }

    if (noteLevel === 'submission') {
      updateSubmissionNote({
        variables: {
          input,
        },
      }).then((res) => {
        console.log('returned results', res);
        const returnedNote = res?.data?.updateSubmissionNote?.submissionNote;
        console.log('returnedNote', returnedNote);
        setNote({
          ...returnedNote,
          submission: returnedNote?.submission?.id as number,
        });
      });
    } else if (noteLevel === 'problem') {
      updateProblemNote({
        variables: {
          input,
        },
      }).then((res) => {
        console.log('returned results', res);
        const returnedNote = res?.data?.updateProblemNote?.problemNote;
        console.log('returnedNote', returnedNote);
        setNote({
          ...returnedNote,
          problem: returnedNote?.problem?.id as number,
        });
      });
    }
    setEditable(false);
  };

  useEffect(() => {
    setOpen(allOpen);
  }, [allOpen]);
  const [deleteMouseEnter, setDeleteMouseEnter] = useState(false);

  return (
    <div className={` mb-3 ${open ? 'accordion-toggle' : ''}`}>
      <div
        className="card-header accordion-header"
        onClick={() => setOpen(!open)}
      >
        <div className="d-flex">
          <FontAwesomeIcon
            icon={faStar}
            className="me-2 mt-1"
            color={note?.isStarred ? 'darkorange' : 'gray'}
          />
          <h5>{note?.title || note?.content?.split('\n')[0]}</h5>
        </div>
        <span className="text-gray">
          <small>{dtStrToLocalShortStr(note?.submittedAt as string)}</small>
        </span>

        <span className="accordion-arrow" />
      </div>
      {open && (
        <div className="card-body pt-2 pb-2">
          <div className="border border-orange p-2 rounded-2 m-2 position-relative">
            {editable && (
              <button
                className="btn btn-primary position-absolute"
                style={{
                  bottom: 10,
                  right: 30,
                }}
                onClick={handleSubmitEdit}
              >
                submit
              </button>
            )}
            <textarea
              ref={inputRef}
              style={{
                resize: 'none',
                border: 'none',
                outline: 'none',
                paddingBottom: 40,
              }}
              value={note?.content}
              disabled={!editable}
              rows={3}
              onChange={(e) => {
                setNote({
                  ...note,
                  content: e.target.value,
                });
              }}
              className="w-100 border-0 bg-transparent"
            />

            <div
              className="d-flex align-items-center"
              style={{ minHeight: 40 }}
            >
              <FontAwesomeIcon
                icon={faEdit}
                className={`ms-3 ${editable ? 'text-primary' : 'text-gray'}`}
                onClick={() => {
                  setEditable((prev) => {
                    return !prev;
                  });
                }}
              />
              <FontAwesomeIcon
                icon={faTrash}
                className={`ms-3 ${
                  deleteMouseEnter ? 'text-primary' : 'text-gray'
                }`}
                onClick={() => {
                  setIsDeleteDialogOpen(true);
                }}
                onMouseLeave={() => {
                  setDeleteMouseEnter(false);
                }}
                onMouseEnter={() => {
                  setDeleteMouseEnter(true);
                }}
              />
              {editable && (
                <div className="d-flex gap-3 ps-3">
                  <FontAwesomeIcon
                    icon={faStar}
                    className={note?.isStarred ? 'text-primary' : 'text-gray'}
                    style={{
                      marginTop: 7,
                    }}
                    onClick={() => {
                      setNote({
                        ...note,
                        isStarred: !note?.isStarred,
                      });
                    }}
                  />
                  <select
                    className="form-select form-select-sm bg-transparent text-gray text-center text-capitalize border-primary"
                    aria-label="select type"
                    style={{ width: 150 }}
                    value={note?.noteType?.toLocaleLowerCase() || 'select type'}
                    onChange={(e) => {
                      setNote({
                        ...note,
                        noteType: e.target.value.toLowerCase(),
                      });
                    }}
                  >
                    <option disabled value="">
                      select type
                    </option>
                    {['intuition', 'stuck_point', 'qna', 'err', 'memo'].map(
                      (type) => (
                        <option value={type}>{type}</option>
                      )
                    )}
                  </select>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="new title"
                    value={note?.title}
                    onChange={(e) => {
                      setNote({
                        ...note,
                        title: e.target.value,
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          {note?.resources?.some((r) => r.resourceType === 'VIDEO') && (
            <h6 className="mb-2 text-gray">Videos</h6>
          )}
          <div className="row">
            {note?.resources
              ?.filter((r) => r.resourceType === 'VIDEO')
              .map((resource) => (
                <VideoCard videoURL={resource.url} />
              ))}
          </div>

          {note?.resources?.some((r) => r.resourceType === 'IMAGE') && (
            <h6 className="text-gray my-2">Images</h6>
          )}
          <div className="row">
            {note?.resources
              ?.filter((r) => r.resourceType === 'IMAGE')
              .map((resource) => (
                <ImageCard imageURL={resource.url} />
              ))}
          </div>
        </div>
      )}
      <ConfirmationDialog
        open={isDeleteDialogOpen}
        title="Delete Note"
        message="Are you sure you want to delete this note?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};

export default NoteDetailAccordion;

import { useState, useEffect, useRef } from 'react';
import { Note } from '../types';
import { dtStrToLocalShortStr } from '../utils/timeUtils';
import { VideoCard, ImageCard } from './Cards';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faStar } from '@fortawesome/free-solid-svg-icons';
import ConfirmationDialog from './ConfirmationDialog';
import { useMutation } from '@apollo/client';
import { DELETE_NOTE, EDIT_NOTE } from '../graphql/noteQueries';

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
  const [updateNote] = useMutation(EDIT_NOTE);
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
      submittedAt: new Date().toISOString(),
    } as any;
    if (noteLevel === 'submission') {
      input['submission'] = parentId;
    } else if (noteLevel === 'problem') {
      input['problem'] = parentId;
    }

    if (noteLevel === 'submission') {
      updateNote({
        variables: {
          input,
        },
      }).then((res) => {
        console.log('returned results', res);
        const returnedNote = res?.data?.updateNote?.submissionNote;
        console.log('returnedNote', returnedNote);
        setNote({
          ...returnedNote,
          submission: returnedNote?.submission?.id as number,
        });
      });
    } else if (noteLevel === 'problem') {
      console.error('problem note function no longer available');
    }
    setEditable(false);
  };

  useEffect(() => {
    setOpen(allOpen);
  }, [allOpen]);
  const [deleteMouseEnter, setDeleteMouseEnter] = useState(false);

  const getDomainFromUrl = (url: string) => {
    // check if url is from leetcode (either .com or .cn) and contains '/solutions/'
    if (url.includes('leetcode.com') && url.includes('/solutions/')) {
      return 'LeetCode';
    } else if (url.includes('leetcode.cn') && url.includes('/solutions/')) {
      return '力扣';
    } else {
      // if not a leetcode solutions post, extract the domain name
      const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/]+)/;
      const match = url.match(regex);
      return match ? match[1] : url;
    }
  };

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
            {note?.resources?.some((r) => r.resourceType === 'VIDEO') && (
              <h6 className="text-gray ms-2 mt-3 mb-2">Videos</h6>
            )}
            <div className="row ms-1">
              {note?.resources
                ?.filter((r) => r.resourceType === 'VIDEO')
                .map((resource) => (
                  <VideoCard videoURL={resource.url} />
                ))}
            </div>

            {note?.resources?.some((r) => r.resourceType === 'IMAGE') && (
              <h6 className="text-gray ms-2 mt-3 mb-2">Images</h6>
            )}
            <div className="row ms-1">
              {note?.resources
                ?.filter((r) => r.resourceType === 'IMAGE')
                .map((resource) => (
                  <ImageCard imageURL={resource.url} />
                ))}
            </div>

            {note?.resources?.some((r) => r.resourceType === 'ARTICLE') && (
              <h6 className="text-gray ms-2 mt-3 mb-2">Articles</h6>
            )}
            <div className="row ms-1">
              {note?.resources
                ?.filter((r) => r.resourceType === 'ARTICLE')
                .map((resource) => (
                  <a href={resource.url} target="_blank">
                    {getDomainFromUrl(resource.url)}
                  </a>
                ))}
            </div>

            {note?.resources?.some(
              (r) => r.resourceType === 'SOLUTION_POST'
            ) && <h6 className="text-gray ms-2 mt-3 mb-2">Solution Posts</h6>}
            <div className="row ms-1">
              {note?.resources
                ?.filter((r) => r.resourceType === 'SOLUTION_POST')
                .map((resource) => (
                  <a href={resource.url} target="_blank">
                    {getDomainFromUrl(resource.url)}
                  </a>
                ))}
            </div>
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

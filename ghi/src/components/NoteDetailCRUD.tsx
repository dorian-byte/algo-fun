import { useCallback, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import lodash, { debounce, set } from 'lodash';
import {
  faStar as fasStar,
  faLink,
  faTimes,
  faExpand,
  faCompress,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import DebounceInput, { DebounceTextArea } from './DebouncedInput';

import { Box } from '@mui/material';
import { CREATE_OR_UPDATE_NOTE } from '../graphql/noteQueries';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';

export type Note = {
  id: number | string;
  title: string;
  content: string;
  noteType: string;
  tags: { name: string }[];
  // hasTags: boolean;
  hasResources: boolean;
  createdAt: string;
  updatedAt: string;
  submittedAt: string;
  isStarred: boolean;
  startLineNumber: number;
  endLineNumber: number;
};

interface NoteDetailCRUDProps {
  notes: Note[];
}

export const NoteType = {
  RED: ['#e53935', '#d35f5f'],
  GREEN: ['#81c784', '#6dbf8b'],
  BLUE: ['#64b5f6', '#6195c7'],
  PURPLE: ['#ba68c8', '#957dbd'],
  PINK: ['#f06292', '#ec8aa4'],
  GRAY: ['#a0a0a0', '#9b9b9b'],
} as any;

const NoteDetailCRUD = ({
  notes,
  noteColorType,
  expandedNoteType,
  setExpandedNoteType,
}: {
  notes: any[];
  noteColorType: string;
  expandedNoteType: string;
  setExpandedNoteType: any;
}) => {
  const [currNoteIdxInType, setCurrNoteIdxInType] = useState(0);
  const [note, setNote] = useState(notes[currNoteIdxInType]);
  const [noteTitle, setNoteTitle] = useState(note?.title || '');
  const [noteContent, setNoteContent] = useState(note?.content || '');
  const [noteTags, setNoteTags] = useState(note?.tags || []);
  const [noteType, setNoteType] = useState(note?.noteType || noteColorType);
  const [isStarred, setIsStarred] = useState(note?.isStarred || false);
  const [hasResource, setHasResource] = useState(note?.hasResources || false);
  const [currTag, setCurrTag] = useState('#');
  const [isFocusedNote, setIsFocusedNote] = useState(false);
  const [createOrUpateNote] = useMutation(CREATE_OR_UPDATE_NOTE);

  const { submissionId } = useParams();
  const [saveState, setSaveState] = useState('');
  useEffect(() => {
    if (!submissionId) return;
    setNote({
      ...note,
      title: noteTitle,
      submission: submissionId,
      content: noteContent,
      noteType: noteType,
      isStarred: isStarred,
    });
  }, [noteTitle, noteContent, noteType, isStarred, submissionId]);

  const handleSave = (valToSave: any) => {
    if (!noteTitle || !noteContent) {
      return;
    }
    if (!submissionId) return;
    let noteData = {
      title: note.title,
      submission: submissionId,
      content: note.content,
      noteType: note.noteType.toLowerCase(),
      isStarred: note.isStarred,
      submittedAt: note.submittedAt || new Date().toISOString(),
    } as any;

    noteData = { ...noteData, ...valToSave };

    if (notes[currNoteIdxInType]?.id) {
      noteData['id'] = +notes[currNoteIdxInType]?.id;
    }
    console.log('noteData', noteData);

    createOrUpateNote({
      variables: {
        input: noteData,
      },
    })
      .then((res) => {
        console.log('saveRes', res);
        if (res.data.updateNote) {
          setSaveState('Saved');
          setTimeout(() => {
            setSaveState('');
          }, 1000);
        }
      })
      .catch((err) => console.error(err));
  };

  const extraCss = (exp: boolean) => {
    return exp
      ? {
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 999,
        }
      : {};
  };

  const extraCss2 = (exp: boolean) => {
    return exp
      ? {
          width: '100%',
          height: 'calc(100vh - 230px)',
        }
      : {
          height: '30vh',
        };
  };

  return (
    <div
      style={{
        position: expandedNoteType === noteType ? 'absolute' : 'inherit',
        ...extraCss(expandedNoteType === noteType),
        display:
          expandedNoteType && expandedNoteType !== noteType ? 'none' : 'block',
      }}
    >
      {/* <div className="mb-4"> */}
      <div className="">
        <Box
          className="note-detail-inside-frame position-relative"
          sx={{
            borderColor:
              NoteType[noteType]?.[1] || NoteType[noteColorType]?.[1],
            backgroundColor: '#0f0f0f',
            boxShadow: isFocusedNote
              ? `0 0 0 2px ${
                  NoteType[noteType]?.[1] || NoteType[noteColorType]?.[1]
                }`
              : 'none',
            '&:hover': {
              borderWidth: 3,
              borderColor:
                NoteType[noteType]?.[1] || NoteType[noteColorType]?.[1],
              boxShadow: `0 0 0 2px ${
                NoteType[noteType]?.[1] || NoteType[noteColorType]?.[1]
              }`,
            },
            ...extraCss2(expandedNoteType === noteType),
          }}
        >
          <Box
            className="position-absolute"
            sx={{
              bottom: 5,
              right: 10,
              opacity: 0.3,
              cursor: 'pointer',
              '&:hover': {
                opacity: 1,
              },
            }}
            onClick={() =>
              setExpandedNoteType((prev: string) => {
                if (prev === noteType) return '';
                return noteType;
              })
            }
          >
            <FontAwesomeIcon
              icon={expandedNoteType === noteType ? faCompress : faExpand}
              className="text-primary"
            />
          </Box>
          <div className="d-flex my-2 align-items-center justify-content-center">
            {Object.keys(NoteType).map((type, index) => (
              <Box
                sx={{
                  backgroundColor:
                    noteType === type || noteColorType === type
                      ? NoteType[type][0] || NoteType[noteColorType][0]
                      : 'transparent',
                  width: 20,
                  border: `3px solid ${NoteType[type][0]}`,
                  height: 20,
                  borderRadius: '999px',
                  margin: 0.7,
                  opacity: noteType === type ? 1 : 0.4,
                  cursor: 'pointer',
                  '&:hover': {
                    opacity: 1,
                  },
                }}
                key={index}
                onClick={() => {
                  if (expandedNoteType === noteType) return;
                  setNoteType(type);
                }}
              ></Box>
            ))}
          </div>
          <div className="d-flex align-items-center">
            {isStarred ? (
              <FontAwesomeIcon
                icon={fasStar}
                className="ms-1 text-primary"
                onClick={() => setIsStarred(false)}
              />
            ) : (
              <FontAwesomeIcon
                icon={farStar}
                className="ms-1 text-primary"
                onClick={() => setIsStarred(true)}
              />
            )}
            <DebounceInput
              onfocus={() => setIsFocusedNote(true)}
              onblur={() => setIsFocusedNote(false)}
              placeholder="title"
              defaultValue={noteTitle}
              debounceTimeout={1000}
              handleDebounce={(value: string) => {
                setNoteTitle(value);
                handleSave({ title: value });
              }}
            />
            {/* <input
              className="no-border ms-2"
              placeholder="title"
              type="text"
              value={noteTitle}
              onChange={(e) => {}}
              onFocus={() => setIsFocusedNote(true)}
              onBlur={() => setIsFocusedNote(false)}
            /> */}
          </div>
          <hr
            style={{
              borderColor:
                NoteType[noteType]?.[1] || NoteType[noteColorType]?.[1],
            }}
          />
          <DebounceTextArea
            onfocus={() => setIsFocusedNote(true)}
            onblur={() => setIsFocusedNote(false)}
            placeholder="Add content here..."
            debounceTimeout={1000}
            defaultValue={noteContent}
            handleDebounce={(value: string) => {
              handleSave({ content: value });
            }}
          />
          {/* <textarea
            className="no-border"
            rows={3}
            value={noteContent}
            placeholder="Add content here..."
            onChange={(e) => {
              setNoteContent(e.target.value);
              console.log('setting content');
              console.log('submissionId', submissionId);
            }}
            onFocus={() => setIsFocusedNote(true)}
            onBlur={() => setIsFocusedNote(false)}
          /> */}

          <div className="my-2">
            <div
              style={{
                border: `1px solid ${
                  NoteType[noteType]?.[1] || NoteType[noteColorType]?.[1]
                }`,
              }}
            ></div>
          </div>
          <div>
            <input
              className="form-control no-border"
              type="text"
              placeholder='Add tags, separated by ","'
              value={currTag}
              onChange={(e) => setCurrTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (currTag === '#' || !currTag) return;
                  setNoteTags([...noteTags, { name: currTag }]);
                  setCurrTag('#');
                }
              }}
              onFocus={() => setIsFocusedNote(true)}
              onBlur={() => setIsFocusedNote(false)}
            />
            <div
              className={`d-flex gap-2 flex-wrap user-select-none overflow-auto`}
              style={{
                height: expandedNoteType === noteType ? 'auto' : '10%',
              }}
            >
              {noteTags.map((tag) => (
                <div
                  className="badge rounded-pill text-dark"
                  style={{
                    backgroundColor:
                      NoteType[noteType]?.[1] || NoteType[noteColorType]?.[1],
                  }}
                >
                  {tag.name}
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="ms-1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setNoteTags(noteTags.filter((t) => t.name !== tag.name));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </Box>

        <div className="d-flex justify-content-between align-items-center p-2">
          {hasResource ? (
            <FontAwesomeIcon
              icon={faLink}
              className="text-primary"
              style={{ width: 25 }}
            />
          ) : (
            <div style={{ width: 25 }}></div>
          )}
          <div className="d-flex justify-content-center align-items-baseline flex-fill">
            {(expandedNoteType === noteType ? notes : notes.slice(0, 8)).map(
              (note, idx) => (
                <span
                  key={idx}
                  style={{
                    height: '10px',
                    width: '10px',
                    backgroundColor:
                      idx === currNoteIdxInType
                        ? NoteType[noteColorType][0]
                        : 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '50%',
                    display: 'inline-block',
                    margin: '0 2px',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    const nt = notes[idx];
                    setNoteTitle(nt.title);
                    setNoteContent(nt.content);
                    setNoteType(nt.noteType);
                    setNoteTags(nt.tags);
                    setIsStarred(nt.isStarred);
                    setHasResource(nt.hasResources);
                    setCurrNoteIdxInType(idx);
                  }}
                ></span>
              )
            )}
            <Box sx={{ opacity: 0.5, '&:hover': { opacity: 1 } }}>
              <FontAwesomeIcon
                icon={faPlusCircle}
                className="text-primary ms-1"
                fontSize={12}
                style={{ cursor: 'pointer' }}
              />
            </Box>
          </div>
          <div
            className="caption ms-auto"
            style={{ fontSize: '0.7rem', width: 25 }}
            onClick={() => {
              handleSave();
            }}
          >
            {saveState}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailCRUD;

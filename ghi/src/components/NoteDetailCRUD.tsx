import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as fasStar,
  faLink,
  faCross,
  faCheck,
  faTimes,
  faExpand,
  faCompress,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';

import {
  Form,
  Button,
  DropdownButton,
  Dropdown,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { Star, Pin } from 'react-bootstrap-icons';
import { Box } from '@mui/material';
import zIndex from '@mui/material/styles/zIndex';

export type Note = {
  id: number;
  title: string;
  content: string;
  noteType: string;
  tags: { name: string }[];
  hasTags: boolean;
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

const NoteDetailCRUD: React.FC<NoteDetailCRUDProps> = ({
  notes,
}: {
  notes: Note[];
}) => {
  const [currNoteIdxInType, setCurrNoteIdxInType] = useState(0);
  const [note, setNote] = useState(notes[currNoteIdxInType]);
  const [noteTitle, setNoteTitle] = useState(note?.title || '');
  const [noteContent, setNoteContent] = useState(note?.content || '');
  const [noteTags, setNoteTags] = useState(note?.tags || []);
  const [noteType, setNoteType] = useState(note?.noteType || 'gray');
  const [isStarred, setIsStarred] = useState(note?.isStarred || false);
  const [hasResource, setHasResource] = useState(note?.hasResources || false);
  const [currTag, setCurrTag] = useState('#');
  const [isFocusedNote, setIsFocusedNote] = useState(false);
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  useEffect(() => {
    // debounce save
    const timeout = setTimeout(() => {
      console.log('save');
    }, 1000);
    return () => clearTimeout(timeout);
  }, [currTag]);
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
          height: '70vh',
        }
      : {};
  };

  useEffect(() => {
    // debounce save
    const timeout = setTimeout(() => {
      console.log('save');
    }, 1000);
    return () => clearTimeout(timeout);
  }, [noteTitle, noteContent]);
  return (
    <div
      style={{
        position: isNoteExpanded ? 'absolute' : 'inherit',
        ...extraCss(isNoteExpanded),
      }}
    >
      <div className="mb-4">
        <Box
          className="note-detail-inside-frame position-relative"
          sx={{
            borderColor: NoteType[noteType][1],
            borderWidth: 3,
            backgroundColor: '#0f0f0f',
            boxShadow: isFocusedNote
              ? `0 0 0 2px ${NoteType[noteType][1]}`
              : 'none',
            '&:hover': {
              borderWidth: 3,
              borderColor: NoteType[noteType][1],
              boxShadow: `0 0 0 2px ${NoteType[noteType][1]}`,
            },
            ...extraCss2(isNoteExpanded),
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
            onClick={() => setIsNoteExpanded((prev) => !prev)}
          >
            <FontAwesomeIcon
              icon={isNoteExpanded ? faCompress : faExpand}
              className="text-primary"
            />
          </Box>
          <div className="d-flex my-2 align-items-center justify-content-center">
            {Object.keys(NoteType).map((type, index) => (
              <Box
                sx={{
                  backgroundColor:
                    noteType === type ? NoteType[type][0] : 'transparent',
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
                onClick={() => setNoteType(type)}
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
            {noteTitle && (
              <input
                className="no-border ms-2"
                type="text"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                onFocus={() => setIsFocusedNote(true)}
                onBlur={() => setIsFocusedNote(false)}
              />
            )}
          </div>
          <hr style={{ borderColor: NoteType[noteType][1] }} />
          <textarea
            className="form-control no-border"
            rows={3}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            onFocus={() => setIsFocusedNote(true)}
            onBlur={() => setIsFocusedNote(false)}
          />

          <div className="my-2">
            <div
              style={{
                border: `1px solid ${NoteType[noteType][1]}`,
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
              className={`d-flex gap-2 flex-wrap user-select-none overflow-auto ${
                isNoteExpanded ? '' : 'h-25'
              }`}
            >
              {noteTags.map((tag) => (
                <div
                  className="badge rounded-pill text-dark"
                  style={{
                    backgroundColor: NoteType[noteType][1],
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
            {(isNoteExpanded ? notes : notes.slice(0, 8)).map((note, idx) => (
              <span
                key={idx}
                style={{
                  height: '10px',
                  width: '10px',
                  backgroundColor:
                    idx === currNoteIdxInType
                      ? NoteType[note.noteType][0]
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
            ))}
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
          >
            saved
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailCRUD;

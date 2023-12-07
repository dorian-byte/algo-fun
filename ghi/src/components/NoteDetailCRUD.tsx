import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar as fasStar,
  faLink,
  faCross,
  faCheck,
  faTimes,
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
import { Chip } from '@mui/material';

type Note = {
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
  note: Note;
}

const NoteType = {
  RED: 'Red',
  GREEN: 'Green',
  BLUE: 'Blue',
  PURPLE: 'Purple',
  PINK: 'Pink',
  GRAY: 'Gray',
};

const NoteDetailCRUD: React.FC<NoteDetailCRUDProps> = ({ note }) => {
  const [noteContent, setNoteContent] = useState(note?.content || '');
  const [noteTags, setNoteTags] = useState(note?.tags || []);
  const [noteType, setNoteType] = useState(note?.noteType || 'gray');
  const [isStarred, setIsStarred] = useState(note?.isStarred || false);
  const [hasResource, setHasResource] = useState(note?.hasResources || false);
  const [currTag, setCurrTag] = useState('#');
  useEffect(() => {
    // debounce save
    const timeout = setTimeout(() => {
      console.log('save');
    }, 1000);
    return () => clearTimeout(timeout);
  }, [currTag]);
  return (
    <div className="">
      <div className="d-flex my-2 align-items-center justify-content-center">
        {Object.keys(NoteType).map((type, index) => (
          <div
            style={{
              backgroundColor: type.toLowerCase(),
              width: 15,
              height: 15,
              borderRadius: '50%',
              margin: 5,
              opacity: noteType === type ? 1 : 0.4,
              cursor: 'pointer',
            }}
            key={index}
            onClick={() => setNoteType(type)}
          ></div>
        ))}
      </div>
      <div className="mb-4">
        <div className="note-detail-inside-frame">
          {note.title && (
            <input
              className="no-border"
              type="text"
              value={note.title}
              onChange={(e) => {
                /* Your update function for title */
              }}
            />
          )}
          <hr />
          <textarea
            className="form-control no-border"
            rows={3}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />

          <div className="ps-2 my-2">
            <div className="border border-bottom customized-border"></div>
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
            />
            <div className="d-flex gap-2 flex-wrap user-select-none">
              {noteTags.map((tag) => (
                <div className="badge badge-outlined bg-transparent text-orange border border-orange">
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
        </div>
        <div className="d-flex justify-content-between align-items-center p-2">
          {hasResource && (
            <FontAwesomeIcon icon={faLink} className="text-primary" />
          )}
          <div className="caption ms-auto" style={{ fontSize: '0.7rem' }}>
            saved
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoteDetailCRUD;

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar, faLink } from '@fortawesome/free-solid-svg-icons';
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
  const [noteTags, setNoteTags] = useState(note?.tags || '');
  const [noteType, setNoteType] = useState(note?.note_type || 'gray');
  const [isStarred, setIsStarred] = useState(note?.is_starred || false);
  const [hasResource, setHasResource] = useState(note?.hasResource || false);

  const handleSave = () => {
    onSave({
      content: noteContent,
      tags: noteTags,
      note_type: noteType,
      is_starred: isStarred,
    });
  };

  return (
    <div className="note-detail">
      {note.title && (
        <input
          className="form-control"
          id="no-border"
          type="text"
          value={note.title}
          onChange={(e) => {
            /* Your update function for title */
          }}
        />
      )}
      <div className="ps-2">
        <div className="border border-bottom customized-border"></div>
      </div>
      <textarea
        className="form-control"
        id="no-border"
        rows={3}
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
      />
      <div className="ps-2">
        <div className="border border-bottom customized-border"></div>
      </div>
      <input
        className="form-control"
        id="no-border"
        type="text"
        value={noteTags}
        onChange={(e) => setNoteTags(e.target.value)}
      />

      <div className="ps-2">
        <div className="border border-bottom customized-border"></div>
      </div>

      <button className="btn btn-primary ms-1">+</button>
      <div className="dropdown">
        <button
          className="btn btn-secondary dropdown-toggle"
          type="button"
          id="dropdown-basic-button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {noteType}
        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdown-basic-button">
          {Object.keys(NoteType).map((type, index) => (
            <li key={index} onClick={() => setNoteType(type)}>
              <a className="dropdown-item">{type}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="icon">
        <FontAwesomeIcon
          icon={isStarred ? fasStar : farStar}
          className="text-warning"
        />
        {hasResource ? (
          <FontAwesomeIcon icon={faLink} className="text-primary" />
        ) : (
          <i className="bi-pin"></i>
        )}
      </div>
      {/* <button className="btn btn-primary" onClick={handleSave}>
          Save Note
        </button> */}
    </div>
  );
};

export default NoteDetailCRUD;

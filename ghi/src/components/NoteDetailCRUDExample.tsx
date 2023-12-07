import React, { useState } from 'react';
import {
  Form,
  Button,
  DropdownButton,
  Dropdown,
  InputGroup,
  FormControl,
} from 'react-bootstrap';
import { Star, Pin } from 'react-bootstrap-icons'; // These icons are from 'react-bootstrap-icons' library

interface NoteDetailProps {
  note?: any; // You can replace 'any' with a more specific type
  onSave: (noteData: any) => void;
}

const NoteType = {
  RED: 'Red',
  GREEN: 'Green',
  BLUE: 'Blue',
  PURPLE: 'Purple',
  PINK: 'Pink',
  GRAY: 'Gray',
};

const NoteDetailCRUD: React.FC<NoteDetailProps> = ({ note, onSave }) => {
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
      <Form>
        <Form.Group>
          {/* <Form.Label>Note Content</Form.Label> */}
          <Form.Control
            as="textarea"
            rows={3}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
          />
        </Form.Group>
        <InputGroup className="mb-3">
          <Form.Control
            as="input"
            placeholder="Enter tags"
            value={noteTags}
            onChange={(e) => setNoteTags(e.target.value)}
          />
          <InputGroup>
            <Button variant="outline-secondary">Add Tag</Button>
          </InputGroup>
        </InputGroup>
        <DropdownButton id="dropdown-basic-button" title={noteType}>
          {Object.keys(NoteType).map((type, index) => (
            <Dropdown.Item key={index} onClick={() => setNoteType(type)}>
              {type}
            </Dropdown.Item>
          ))}
        </DropdownButton>
        <div className="icon">
          {isStarred ? <Star fill="gold" /> : <Star />}
          {hasResource ? <Pin fill="blue" /> : <Pin />}
        </div>
        {/* <Button variant="primary" onClick={handleSave}>
          Save Note
        </Button> */}
      </Form>
    </div>
  );
};

export default NoteDetailCRUD;

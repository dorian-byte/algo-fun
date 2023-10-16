import { useState } from 'react';
import { Note } from '../types';
import { formatTime } from '../utils/timeUtils';
import { VideoCard, ImageCard } from '../components/Cards';

interface AccordionProps {
  note: Note;
}

const Accordion: React.FC<AccordionProps> = ({ note }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`card mb-3 ${open ? 'accordion-toggle' : ''}`}>
      <div
        className="card-header accordion-header"
        onClick={() => setOpen(!open)}
      >
        {note.title || note.content.split('\n')[0]}
        <span className="accordion-arrow" />
      </div>
      {open && (
        <div className="card-body">
          {/* have to add "as string" here even if the type specified either string or Date */}
          <p className="text-muted">{formatTime(note.createdAt as string)}</p>
          <p>{note.content}</p>
          <VideoCard videoURL={undefined} />
          <ImageCard imageURL={undefined} />
          <div></div>
        </div>
      )}
    </div>
  );
};

export default Accordion;

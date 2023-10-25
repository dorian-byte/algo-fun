import { useState, useEffect } from 'react';
import { Note } from '../types';
import { dtStrToLocalShortStr } from '../utils/timeUtils';
import { VideoCard, ImageCard } from './Cards';

interface NoteDetailAccordionProps {
  note: Note;
  allOpen: boolean;
}

const NoteDetailAccordion: React.FC<NoteDetailAccordionProps> = ({
  note,
  allOpen,
}) => {
  const [open, setOpen] = useState(allOpen);

  useEffect(() => {
    setOpen(allOpen);
  }, [allOpen]);

  return (
    <div className={` mb-3 ${open ? 'accordion-toggle' : ''}`}>
      <div
        className="card-header accordion-header"
        onClick={() => setOpen(!open)}
      >
        <h5>{note.title || note.content.split('\n')[0]}</h5>
        <span className="text-gray">
          <small>{dtStrToLocalShortStr(note.submittedAt as string)}</small>
        </span>
        <span className="accordion-arrow" />
      </div>
      {open && (
        <div className="card-body ps-3 pt-2 pb-2">
          <p className="pt-2">{note.content}</p>
          {note?.resources?.some((r) => r.resourceType === 'VIDEO') && (
            <h6 className="mb-2 text-gray">Videos</h6>
          )}
          <div className="row">
            {note.resources
              .filter((r) => r.resourceType === 'VIDEO')
              .map((resource) => (
                <VideoCard videoURL={resource.url} />
              ))}
          </div>

          {note?.resources.some((r) => r.resourceType === 'IMAGE') && (
            <h6 className="text-gray my-2">Images</h6>
          )}
          <div className="row">
            {note.resources
              .filter((r) => r.resourceType === 'IMAGE')
              .map((resource) => (
                <ImageCard imageURL={resource.url} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteDetailAccordion;

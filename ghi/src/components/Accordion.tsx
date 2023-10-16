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
        <span className="text-gray">
          <small>... {formatTime(note.createdAt as string)}</small>
        </span>
        <span className="accordion-arrow" />
      </div>
      {open && (
        <div className="card-body">
          {/* have to add "as string" here even if the type specified either string or Date */}
          <p>{note.content}</p>
          <div>
            <div className="container" id="resource-container">
              <h5 className="mb-2 text-primary">Videos</h5>
              <div className="row">
                {note.resources
                  .filter((r) => r.resourceType === 'VIDEO')
                  .map((resource) => (
                    <VideoCard videoURL={resource.url} />
                  ))}
              </div>
            </div>
          </div>

          <div>
            <div className="container" id="resource-container">
              <h5 className="mb-2 text-primary">Images</h5>
              <div className="row">
                {note.resources
                  .filter((r) => r.resourceType === 'IMAGE')
                  .map((resource) => (
                    <ImageCard imageURL={resource.url} />
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accordion;

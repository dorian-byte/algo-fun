import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import NoteDetailAccordion from '../components/NoteDetailAccordion';
import { FETCH_ALL_NOTES } from '../graphql/noteQueries';
import { useLocation } from 'react-router-dom';
import { yellowToOrangeContainerStyle } from '../components/ProblemList';

const NoteListPage = () => {
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [allOpen, setAllOpen] = useState(true);
  const {
    data: allNotesData,
    loading: allNotesLoading,
    error: allNotesError,
    refetch: refetchAllNotes,
  } = useQuery(FETCH_ALL_NOTES);
  useEffect(() => {
    if (allNotesData?.allNotes) {
      setAllNotes([...allNotesData.allNotes]);
    }
    console.log('allNotes', allNotes);
  }, [allNotesData]);

  const { pathname } = useLocation();
  useEffect(() => {
    refetchAllNotes();
  }, [pathname]);

  const [toggleButtonColor, setToggleButtonColor] = useState('');

  if (allNotesError) {
    return <div>Error!</div>;
  }

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex justify-content-end me-5 align-items-center position-relative mt-5 mb-4 w-100 pe-5">
        <h2
          className="page-header text-center"
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translate(-50%, -50%)',
          }}
        >
          All Notes
        </h2>
        <button
          className="btn btn-outline-primary"
          style={{
            color: toggleButtonColor,
            cursor: 'pointer',
            fontSize: '0.9rem',
            width: 'fit-content',
          }}
          onClick={() => setAllOpen((prevState) => !prevState)}
        >
          {allOpen ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      <div
        className="overflow-auto scrollbar-hidden position-relative"
        style={{
          ...yellowToOrangeContainerStyle,
        }}
      >
        <div className="bg-dark p-3">
          {allNotes
            .sort((a, b) => {
              const dateA = new Date(b.submittedAt as any).getTime();
              const dateB = new Date(a.submittedAt as any).getTime();
              return dateB - dateA;
            })
            .map((note) => (
              <NoteDetailAccordion
                key={note?.id}
                note={note}
                allOpen={allOpen}
                parentId={
                  note?.__typename === 'ProblemNoteType'
                    ? note?.problem?.id
                    : note?.submission?.id
                }
                noteLevel={
                  note?.__typename === 'ProblemNoteType'
                    ? 'problem'
                    : 'submission'
                }
                refresh={() => {
                  refetchAllNotes();
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default NoteListPage;

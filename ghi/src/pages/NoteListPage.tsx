import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import NoteDetailAccordion from '../components/NoteDetailAccordion';
import { FETCH_ALL_NOTES } from '../graphql/noteQueries';
import { useLocation } from 'react-router-dom';

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
    <div>
      <div className="d-flex justify-content-center">
        <h1 className="page-header mt-5 mb-2">All Notes</h1>
      </div>
      <div className="container overflow-auto scrollbar-hidden position-relative">
        <div
          className="position-absolute"
          style={{
            right: 15,
            top: 10,
            color: toggleButtonColor,
            cursor: 'pointer',
            fontSize: '0.9rem',
          }}
          onClick={() => setAllOpen((prevState) => !prevState)}
          onMouseEnter={() => setToggleButtonColor('orange')}
          onMouseLeave={() => setToggleButtonColor('')}
        >
          {allOpen ? 'Collapse All' : 'Expand All'}
        </div>
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
  );
};

export default NoteListPage;

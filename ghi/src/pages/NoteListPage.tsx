import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import NoteDetailAccordion from '../components/NoteDetailAccordion';
import {
  FETCH_ALL_PROBLEM_NOTES,
  FETCH_ALL_SUBMISSION_NOTES,
} from '../graphql/noteQueries';
import { useLocation } from 'react-router-dom';

const NoteListPage = () => {
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [allOpen, setAllOpen] = useState(true);
  const {
    data: allProblemNotesData,
    loading: allProblemNotesLoading,
    error: allProblemNotesError,
    refetch: refetchAllProblemNotes,
  } = useQuery(FETCH_ALL_PROBLEM_NOTES);
  const {
    data: allSubmissionNotesData,
    loading: allSubmissionNotesLoading,
    error: allSubmissionNotesError,
    refetch: refetchAllSubmissionNotes,
  } = useQuery(FETCH_ALL_SUBMISSION_NOTES);
  useEffect(() => {
    if (
      allProblemNotesData?.allProblemNotes &&
      allSubmissionNotesData?.allSubmissionNotes
    ) {
      setAllNotes([
        ...allProblemNotesData?.allProblemNotes,
        ...allSubmissionNotesData?.allSubmissionNotes,
      ]);
    }
    console.log('allNotes', allNotes);
  }, [allProblemNotesData, allSubmissionNotesData]);

  const { pathname } = useLocation();
  useEffect(() => {
    refetchAllProblemNotes();
    refetchAllSubmissionNotes();
  }, [pathname]);

  const [toggleButtonColor, setToggleButtonColor] = useState('');

  if (allProblemNotesLoading || allSubmissionNotesLoading) {
    return <div>Loading...</div>;
  }
  if (allProblemNotesError || allSubmissionNotesError) {
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
                refetchAllProblemNotes();
                refetchAllSubmissionNotes();
              }}
            />
          ))}
      </div>
    </div>
  );
};

export default NoteListPage;

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import NoteDetailAccordion from '../components/NoteDetailAccordion';
import {
  FETCH_ALL_PROBLEM_NOTES,
  FETCH_ALL_SUBMISSION_NOTES,
} from '../components/NoteQueries';

const NoteListPage = () => {
  const [allNotes, setAllNotes] = useState<any[]>([]);
  const [allOpen, setAllOpen] = useState(true);
  const {
    data: allProblemNotesData,
    loading: allProblemNotesLoading,
    error: allProblemNotesError,
  } = useQuery(FETCH_ALL_PROBLEM_NOTES);
  const {
    data: allSubmissionNotesData,
    loading: allSubmissionNotesLoading,
    error: allSubmissionNotesError,
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

  if (allProblemNotesLoading || allSubmissionNotesLoading) {
    return <div>Loading...</div>;
  }
  if (allProblemNotesError || allSubmissionNotesError) {
    return <div>Error!</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between">
        <h1 className="m-4 page-header">All Notes</h1>
        <button
          className="btn btn-primary py-0 px-2"
          onClick={() => setAllOpen((prevState) => !prevState)}
        >
          {allOpen ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      <div className="container">
        {allNotes
          .sort((a, b) => {
            return new Date(a.submittedAt) - new Date(b.submittedAt as any);
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
            />
          ))}
      </div>
    </div>
  );
};

export default NoteListPage;

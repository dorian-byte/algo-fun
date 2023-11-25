import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import NoteDetailAccordion from '../components/NoteDetailAccordion';
import {
  FETCH_ALL_PROBLEM_NOTES,
  FETCH_ALL_SUBMISSION_NOTES,
} from '../components/NoteQueries';

const NoteListPage = () => {
  const [allNotes, setAllNotes] = useState<any[]>([]);
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
  }, [allProblemNotesData, allSubmissionNotesData]);

  if (allProblemNotesLoading || allSubmissionNotesLoading) {
    return <div>Loading...</div>;
  }
  if (allProblemNotesError || allSubmissionNotesError) {
    return <div>Error!</div>;
  }

  return (
    <div>
      <h1 className="page-header mt-5">Note List Page</h1>
      <div className="accordion">
        {allNotes.map((note) => (
          <NoteDetailAccordion
            key={note?.id}
            note={note}
            allOpen={false}
            noteLevel={'problem'}
            parentId={'1'}
          />
        ))}
      </div>
    </div>
  );
};

export default NoteListPage;

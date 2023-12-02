import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import NoteDetailAccordion from './NoteDetailAccordion';
import { ALL_NOTES_BY_PROBLEM_ID } from '../graphql/noteQueries';

const ProblemNoteListTab = () => {
  const { problemId } = useParams();
  const { loading, error, data } = useQuery(ALL_NOTES_BY_PROBLEM_ID, {
    variables: { id: problemId ? +problemId : 0 },
  });
  const [notes, setNotes] = useState([] as any[]);
  const [allOpen, setAllOpen] = useState(true);

  useEffect(() => {
    if (data) {
      setNotes(() =>
        data.problemById.submissions.reduce((acc: any, cur: any) => {
          return [...acc, ...cur.notes];
        }, [])
      );
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div style={{ maxHeight: '75vh', overflowY: 'hidden' }}>
      <button
        className="btn btn-sm btn-outline-primary"
        onClick={() => setAllOpen((prevState) => !prevState)}
      >
        {allOpen ? 'collapse all' : 'expand all'}
      </button>
      {notes.map((note) => (
        <NoteDetailAccordion
          key={note?.id as string}
          note={note}
          allOpen={allOpen}
          parentId={problemId as string}
          noteLevel="problem"
        />
      ))}
    </div>
  );
};

export default ProblemNoteListTab;

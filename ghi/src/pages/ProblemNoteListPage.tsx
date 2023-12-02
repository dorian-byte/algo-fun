import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import NoteDetailAccordion from '../components/NoteDetailAccordion';
import { ALL_NOTES_BY_PROBLEM_ID } from '../graphql/noteQueries';

const ProblemNoteListPage = () => {
  const { problemId } = useParams();
  const [submissionNotes, setSubmissionNotes] = useState([]);
  const { loading, error, data, refetch } = useQuery(ALL_NOTES_BY_PROBLEM_ID, {
    variables: { id: problemId ? +problemId : 0 },
  });
  const [allOpen, setAllOpen] = useState(true);

  useEffect(() => {
    if (data) {
      // console.log(data);
      setSubmissionNotes(
        data.problemById.submissions.reduce((acc: any, cur: any) => {
          return [...acc, ...cur.notes];
        }, [])
      );
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [problemId]);
  // useEffect(() => {
  //   console.log('pnotes', problemNotes);
  //   console.log('snotes', submissionNotes);
  // }, [problemNotes, submissionNotes]);

  const toggleAll = () => {
    setAllOpen((prevState) => !prevState);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div
      className="scrollbar-hidden overflow-auto"
      style={{
        maxHeight: 'calc(100vh - 60px)',
      }}
    >
      <div className="d-flex justify-content-between">
        <h1 className="m-4 page-header">
          {data.problemById.leetcodeNumber}
          {'. '}
          {data.problemById.title}
        </h1>
        <button onClick={toggleAll} className="btn btn-primary py-0 px-2">
          {allOpen ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="accordion mb-4">
        {/* {problemNotes.length > 0 && (
          <>
            <h3 className="mb-3 text-center section-heading">Problem Notes</h3>
            <div className="container overflow-auto scrollbar-hidden">
              {problemNotes.map((note: any) => (
                <NoteDetailAccordion
                  key={note.id}
                  note={note}
                  allOpen={allOpen}
                  parentId={problemId as string}
                  noteLevel="problem"
                />
              ))}
            </div>
          </>
        )} */}
        {submissionNotes.length > 0 && (
          <>
            <h3 className="my-3 text-center section-heading">
              Submission Notes
            </h3>
            <div className="container overflow-auto scrollbar-hidden">
              {submissionNotes.map((note: any) => (
                <NoteDetailAccordion
                  key={note.id}
                  note={note}
                  allOpen={allOpen}
                  parentId={note?.submission?.id}
                  noteLevel="submission"
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProblemNoteListPage;

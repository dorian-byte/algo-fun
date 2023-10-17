import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import NoteAccordion from '../components/NoteAccordion';

const PROBLEM_NOTES = gql`
  query ProblemNotes($id: Int!) {
    problemById(id: $id) {
      id
      title
      leetcodeNumber
      notes {
        id
        title
        content
        createdAt
        updatedAt
        isStarred
        noteType
        startLineNumber
        endLineNumber
        resources {
          id
          title
          url
          resourceType
        }
      }
      submissions {
        id
        passed
        notes {
          id
          title
          content
          createdAt
          updatedAt
          isStarred
          noteType
          startLineNumber
          endLineNumber
          resources {
            id
            title
            url
            resourceType
          }
        }
      }
    }
  }
`;

const ProblemNoteListPage = () => {
  const { problemId } = useParams();
  const [problemNotes, setProblemNotes] = useState([]);
  const [allOpen, setAllOpen] = useState(true);
  const [submissionNotes, setSubmissionNotes] = useState([]);
  const { loading, error, data } = useQuery(PROBLEM_NOTES, {
    variables: { id: problemId ? +problemId : 0 },
  });

  useEffect(() => {
    if (data) {
      // console.log(data);
      setProblemNotes(data.problemById.notes);
      setSubmissionNotes(
        data.problemById.submissions.reduce((acc: any, cur: any) => {
          return [...acc, ...cur.notes];
        }, [])
      );
    }
  }, [data]);

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
    <>
      <div className="d-flex justify-content-between">
        <div className="m-4 page-header">
          {data.problemById.leetcodeNumber}
          {'. '}
          {data.problemById.title}
        </div>
        <button onClick={toggleAll} className="btn btn-primary py-0 px-2">
          {allOpen ? 'Collapse All' : 'Expand All'}
        </button>
      </div>

      <div className="accordion mb-4">
        {problemNotes.length > 0 && (
          <>
            <h3 className="mb-3 text-center section-heading">Problem Notes</h3>
            <div className="container">
              {problemNotes.map((note: any) => (
                <NoteAccordion key={note.id} note={note} allOpen={allOpen} />
              ))}
            </div>
          </>
        )}
        {submissionNotes.length > 0 && (
          <>
            <h3 className="my-3 text-center section-heading">
              Submission Notes
            </h3>
            <div className="container">
              {submissionNotes.map((note: any) => (
                <NoteAccordion key={note.id} note={note} allOpen={allOpen} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProblemNoteListPage;

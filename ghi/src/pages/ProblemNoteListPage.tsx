import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import Accordion from '../components/Accordion';

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <h2 className="mt-4 mb-4 text-light headline">
        {data.problemById.leetcodeNumber}
        {'. '}
        {data.problemById.title}
      </h2>
      <div className="accordion mb-4" id="notesAccordion">
        {problemNotes.length > 0 && (
          <>
            <h3 className="mb-4 text-light text-center">Problem Notes</h3>
            <div className="container">
              {problemNotes.map((note: any) => (
                <Accordion key={note.id} note={note} />
              ))}
            </div>
          </>
        )}
        {submissionNotes.length > 0 && (
          <>
            <h3 className="m-4 text-light text-center">Submission Notes</h3>
            <div className="container">
              {submissionNotes.map((note: any) => (
                <Accordion key={note.id} note={note} />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProblemNoteListPage;

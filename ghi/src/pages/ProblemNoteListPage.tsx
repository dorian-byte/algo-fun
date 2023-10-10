import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { gql, useQuery } from '@apollo/client';
import { formatTime } from '../utils/timeFormat';

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
      console.log(data);
      setProblemNotes(() => {
        const pNotes = data.problemById.notes;
        return pNotes.map((note: any) => ({
          ...note,
          isProblemNote: true,
          problemId: data.problemById.id,
        }));
      });
      setSubmissionNotes(
        data.problemById.submissions.reduce((acc: any, cur: any) => {
          const parsedNotes = cur.notes.map((note: any) => ({
            ...note,
            isSubmissionNote: true,
            submissionId: cur.id,
          }));
          acc = acc.concat(parsedNotes);
          return acc;
        }, [])
      );
    }
  }, [data]);

  useEffect(() => {
    console.log('pnotes', problemNotes);
    console.log('snotes', submissionNotes);
  }, [problemNotes, submissionNotes]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <h2 className="mb-4 text-light">
        {data.problemById.leetcodeNumber}
        {'. '}
        {data.problemById.title}
      </h2>
      {problemNotes.length > 0 && (
        <>
          <h3 className="mb-4 text-light">Problem Notes</h3>
          <div className="container">
            {problemNotes.map((nt: any) => (
              <div className="card mb-3" key={nt.id}>
                <div className="card-body">
                  <h5 className="card-title">{nt.title}</h5>
                  <p className="card-text">{nt.content}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Created at {formatTime(nt.createdAt)}
                    </small>
                  </p>
                </div>
              </div>
            ))}
          </div>
          <h3 className="m-4 text-light">Submission Notes</h3>
          <div className="container">
            {submissionNotes.map((nt: any) => (
              <div className="card mb-3" key={nt.id}>
                <div className="card-body">
                  <h5 className="card-title">{nt.title}</h5>
                  <p className="card-text">{nt.content}</p>
                  <p className="card-text">
                    <small className="text-muted">
                      Created at {formatTime(nt.createdAt)}
                    </small>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default ProblemNoteListPage;

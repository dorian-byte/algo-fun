import { useEffect, useState } from 'react';
import { Hash, useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import NoteDetailCRUD from '../components/NoteDetailCRUD';
import { Note, NoteType } from '../components/NoteDetailCRUD';

const SUBMISSION_NOTES = gql`
  query SubmissionNotes($id: Int!) {
    submissionById(id: $id) {
      id
      passed
      notes {
        id
        title
        content
        noteType
        tags {
          name
        }
        hasTags
        hasResources
        createdAt
        updatedAt
        submittedAt
        isStarred
        startLineNumber
        endLineNumber
      }
    }
  }
`;

const SubmissionNoteCRUDListPage = () => {
  const { submissionId } = useParams();
  const [submissionNotes, setSubmissionNotes] = useState<{
    [key: string]: Note[];
  }>({});
  const { loading, error, data } = useQuery(SUBMISSION_NOTES, {
    // FIXME
    variables: { id: 4 },
  });
  useEffect(() => {
    if (data) {
      setSubmissionNotes(() => {
        const notes = data.submissionById.notes;
        const noteTypeMap = {} as { [key: string]: Note[] };
        Object.keys(NoteType).map((type: string) => {
          noteTypeMap[type] = [];
        });
        return notes.reduce((acc: any, note: Note) => {
          acc[note.noteType].push(note);
          return acc;
        }, noteTypeMap);
      });
    }
  }, [data]);
  useEffect(() => {
    console.log('submissionNotes', submissionNotes);
  }, [submissionNotes]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div className="d-flex flex-wrap gap-2 justify-content-around align-items-around position-relative">
      {Object.keys(submissionNotes).map((nt: string) => (
        <NoteDetailCRUD notes={submissionNotes[nt] as Note[]} />
      ))}
    </div>
  );
};

export default SubmissionNoteCRUDListPage;

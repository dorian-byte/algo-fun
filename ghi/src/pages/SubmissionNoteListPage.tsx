import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import Accordion from '../components/NoteListAccordion';

const SUBMISSION_NOTES = gql`
  query SubmissionNotes($id: Int!) {
    submissionById(id: $id) {
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
`;

const SubmissionNoteListPage = () => {
  const { submissionId } = useParams();
  const [submissionNotes, setSubmissionNotes] = useState([]);
  const { loading, error, data } = useQuery(SUBMISSION_NOTES, {
    variables: { id: submissionId ? +submissionId : 0 },
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      setSubmissionNotes(data.submissionById.notes);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <div className="section-heading m-4">Submission Notes</div>
      <div className="container mt-3">
        {submissionNotes.map((note: any) => (
          <Accordion key={note.id} note={note} />
        ))}
      </div>
    </div>
  );
};

export default SubmissionNoteListPage;

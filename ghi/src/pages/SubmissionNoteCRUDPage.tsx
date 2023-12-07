import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import NoteDetailCRUD from '../components/NoteDetailCRUD';
import { Container, Row, Col } from 'react-bootstrap';

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

const SubmissionNoteCRUDPage = () => {
  const { submissionId } = useParams();
  const [submissionNotes, setSubmissionNotes] = useState([]);
  const { loading, error, data } = useQuery(SUBMISSION_NOTES, {
    // FIXME
    variables: { id: 4 },
  });
  useEffect(() => {
    if (data) {
      setSubmissionNotes(data.submissionById.notes);
    }
  }, [data]);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  return (
    <div className="d-flex flex-wrap gap-3">
      {submissionNotes.map((note: any) => (
        <NoteDetailCRUD note={note} />
      ))}
    </div>
  );
};

export default SubmissionNoteCRUDPage;

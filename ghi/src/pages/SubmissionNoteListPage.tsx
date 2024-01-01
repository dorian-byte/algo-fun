import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import NoteDetailAccordion from '../components/NoteDetailAccordion';

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
        submittedAt
        isStarred
        startLineNumber
        endLineNumber
      }
    }
  }
`;

const SubmissionNoteListPage = () => {
  const { submissionId } = useParams();
  const [submissionNotes, setSubmissionNotes] = useState([]);
  const [allOpen, setAllOpen] = useState(true);
  const { loading, error, data, refetch } = useQuery(SUBMISSION_NOTES, {
    variables: { id: submissionId ? +submissionId : 0 },
  });

  useEffect(() => {
    if (data) {
      setSubmissionNotes(data.submissionById.notes);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [submissionId]);

  const toggleAll = () => {
    setAllOpen((prevState) => !prevState);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div>
      <div className="d-flex justify-content-between">
        <div className="section-heading m-4">Submission Notes</div>
        <button onClick={toggleAll} className="btn btn-primary py-0 px-2">
          {allOpen ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      <div className="container overflow-auto scrollbar-hidden mt-3">
        {submissionNotes.map((note: any) => (
          <NoteDetailAccordion key={note.id} note={note} allOpen={allOpen} />
        ))}
      </div>
    </div>
  );
};

export default SubmissionNoteListPage;

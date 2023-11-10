import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useMutation, useQuery } from '@apollo/client';
import NoteForm, { NoteType } from '../components/NoteForm';
import { dtToLocalISO16 } from '../utils/timeUtils';

const FETCH_PROBLEM = gql`
  query FetchProblem($id: Int!) {
    problemById(id: $id) {
      id
      title
      leetcodeNumber
    }
  }
`;

const FETCH_ALL_PROBLEMS = gql`
  query FetchAllProblems {
    allProblems {
      id
      title
      leetcodeNumber
    }
  }
`;

const CREATE_NOTE = gql`
  mutation CreateNote($input: ProblemNoteMutationInput!) {
    updateProblemNote(input: $input) {
      problemNote {
        problem {
          id
        }
        title
        content
        submittedAt
        isStarred
        noteType
        startLineNumber
        endLineNumber
      }
    }
  }
`;

const ProblemNoteCreatePage = () => {
  return (
    <div className="container mt-5">
      <h3 className="page-header mb-4">New Note</h3>
      <NoteForm />
    </div>
  );
};

export default ProblemNoteCreatePage;

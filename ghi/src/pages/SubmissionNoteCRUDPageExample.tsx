import React from 'react';
import NoteDetailCRUD from '../components/NoteDetailCRUDExample';
import { Container, Row, Col } from 'react-bootstrap';

const mockNotes = [
  {
    id: 1,
    content:
      'Explore basic recursion problems to strengthen foundational skills.',
    tags: '#recursion #beginner',
    color: 'red',
    isStarred: false,
    hasResource: true,
  },
  {
    id: 2,
    content: 'Review binary trees and their common traversal algorithms.',
    tags: '#binaryTree #traversal',
    color: 'green',
    isStarred: true,
    hasResource: false,
  },
  {
    id: 3,
    content: 'Deep dive into graph theory and network analysis.',
    tags: '#graphs #networkAnalysis',
    color: 'blue',
    isStarred: false,
    hasResource: false,
  },
  {
    id: 4,
    content:
      'Understand the applications of dynamic programming in optimization problems.',
    tags: '#dynamicProgramming #optimization',
    color: 'purple',
    isStarred: true,
    hasResource: true,
  },
  {
    id: 5,
    content: 'Study sorting algorithms and their time complexities.',
    tags: '#sortingAlgorithms #complexity',
    color: 'pink',
    isStarred: false,
    hasResource: true,
  },
  {
    id: 6,
    content: 'Analyze different strategies for solving combinatorial problems.',
    tags: '#combinatorics #strategy',
    color: 'gray',
    isStarred: true,
    hasResource: false,
  },
];

const SubmissionNoteCRUDPage: React.FC = () => {
  const handleSave = (noteData: any) => {
    // Implement the save logic here
    console.log('Saving note:', noteData);
  };

  return (
    <Container>
      <Row>
        {mockNotes.map((note) => (
          <Col md={4} key={note.id}>
            <NoteDetailCRUD note={note} onSave={handleSave} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default SubmissionNoteCRUDPage;

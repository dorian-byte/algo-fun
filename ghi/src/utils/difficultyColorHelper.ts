export const difficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'HARD':
      return 'red';
    case 'EASY':
      return 'green';
    case 'MEDIUM':
      return 'orange';
    default:
      return 'inherit';
  }
};

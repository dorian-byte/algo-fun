// checks if a problem ever has a passed submission
export const hasPassed = (submissions: any[] | undefined): boolean => {
  if (!submissions) return false;
  return submissions.some((submission) =>
    [
      'GUIDED_PASS',
      'UNSTEADY_PASS',
      'SMOOTH_PASS',
      'SMOOTH_OPTIMAL_PASS',
    ].includes(submission.proficiencyLevel)
  );
};

export const allFailed = (submissions: any[] | undefined): boolean => {
  if (!submissions || submissions.length === 0) return false;
  return submissions.every((submission) =>
    ['NO_UNDERSTANDING', 'CONCEPTUAL_UNDERSTANDING', 'NO_PASS'].includes(
      submission.proficiencyLevel
    )
  );
};
// checks if a problem ever has a passed submission
export const hasPassed = (submissions: any[] | undefined): boolean => {
  if (!submissions) return false;
  return submissions.some((sm) => sm.passed);
};

export const allFailed = (submissions: any[] | undefined): boolean => {
  if (!submissions || submissions.length === 0) return false;
  return submissions.every((sm) => !sm.passed);
};
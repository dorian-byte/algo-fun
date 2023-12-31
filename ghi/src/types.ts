export interface Resource {
  id: string;
  title: string;
  url: string;
  resourceType: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  submittedAt: Date | string;
  isStarred: boolean;
  startLineNumber: number;
  endLineNumber: number;
  resources: Resource[];
}

export enum Complexity {
  O1 = 'o1',
  NSQRT = 'nsqrt',
  LOGN = 'logn',
  N = 'n',
  NLOGN = 'nlogn',
  N2 = 'n2',
  N3 = 'n3',
  _2N = '2n',
  NFACTORIAL = 'nfactorial',
}

export enum ProficiencyLevel {
  NO_UNDERSTANDING = 'no_understanding',
  CONCEPTUAL_UNDERSTANDING = 'conceptual_understanding',
  NO_PASS = 'no_pass',
  GUIDED_PASS = 'guided_pass',
  UNSTEADY_PASS = 'unsteady_pass',
  SMOOTH_PASS = 'smooth_pass',
  SMOOTH_OPTIMAL_PASS = 'smooth_optimal_pass',
}

export interface Topic {
  id: string;
  name: string;
}

export interface Submission {
  id: string;
  code: string;
  proficiencyLevel: ProficiencyLevel;
  submittedAt: Date | string;
  duration: number | null;
  isSolution: boolean;
  isInterviewMode: boolean;
  isWhiteboardMode: boolean;
  timeComplexity: Complexity;
  spaceComplexity: Complexity;
  methods: Topic[];
  hasNotes: boolean;
  notesCount: number;
  passed: boolean;
}

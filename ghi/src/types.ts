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

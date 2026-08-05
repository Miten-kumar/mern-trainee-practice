export type JobStatus =
  | "WAITING"
  | "ACTIVE"
  | "COMPLETED"
  | "FAILED";


export type JobType =
  | "EMAIL"
  | "IMAGE";


export interface JobPayload {

  to?: string;

  subject?: string;

  message?: string;

  imageName?: string;

}


export interface Job {

  id: number;

  jobId: string;

  type: JobType;

  status: JobStatus;

  progress: number;

  priority: number;

  payload: JobPayload;

  error?: string | null;

  createdAt: string;

}
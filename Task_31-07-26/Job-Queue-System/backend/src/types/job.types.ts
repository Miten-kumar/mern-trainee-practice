export interface EmailJobData {
  to: string;
  subject: string;
  message: string;
}

export interface ImageJobData {
  imageName: string;
  imagePath?: string;
}

export interface JobResponse {
  success: boolean;
  message: string;
  jobId?: string;
}

export type JobType = "EMAIL" | "IMAGE";

export type JobStatus =
  | "WAITING"
  | "ACTIVE"
  | "COMPLETED"
  | "FAILED";

export interface JobRecord {
  jobId: string;
  type: JobType;
  status: JobStatus;
  progress: number;
  priority: number;
  payload: EmailJobData | ImageJobData;
  error?: string;
}
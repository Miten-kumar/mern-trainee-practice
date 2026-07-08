export interface UploadedFile {
  id: number;
  name: string;
  originalName?: string;
  size?: number;
  type?: string;
  url?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  files: UploadedFile[];
}
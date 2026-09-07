import { apiClient } from './client';

export interface UploadResult {
  recordsProcessed: number;
  recordsSkipped: number;
  errors: string[];
  predictionsTriggered: boolean;
}

export const uploadApi = {
  uploadCUF: async (file: File, onProgress?: (pct: number) => void): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await apiClient.post<UploadResult>('/upload/cuf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (evt) => {
        if (evt.total && onProgress) {
          onProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      },
    });
    return data;
  },
};

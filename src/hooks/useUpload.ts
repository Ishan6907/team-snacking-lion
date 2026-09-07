import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadApi, type UploadResult } from '@/api/upload';

export function useUpload() {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: (file: File) => uploadApi.uploadCUF(file, setProgress),
    onSettled: () => setProgress(0),
  });

  return {
    upload: mutation.mutate,
    progress,
    isUploading: mutation.isLoading,
    result: mutation.data as UploadResult | undefined,
    error: mutation.error as Error | null,
    reset: mutation.reset,
  };
}

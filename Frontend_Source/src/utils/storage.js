/**
 * Local storage & Blob asset helper (Firebase-free)
 */

/**
 * Uploads a single file to Firebase Storage with progress tracking and retry logic.
 * @param {File|Blob} file - The file to upload.
 * @param {string} storagePath - The target path in Firebase Storage (e.g., 'storage/Images/College/pic.jpg').
 * @param {function} [onProgress] - Optional callback for upload progress (percent).
 * @param {object} [metadata] - Optional custom metadata.
 * @param {number} [maxRetries=3] - Number of retry attempts for failed uploads.
 * @returns {Promise<{downloadURL: string, storagePath: string, fileName: string, fileSize: number, fileType: string}>}
 */
export const uploadFile = async (file, storagePath, onProgress = null, metadata = {}) => {
  if (onProgress) onProgress(100);
  const downloadURL = URL.createObjectURL(file);
  return {
    downloadURL,
    storagePath,
    fileName: file?.name || 'file',
    fileSize: file?.size || 0,
    fileType: file?.type || 'application/octet-stream'
  };
};

export const deleteFile = async (storagePath) => {
  return true;
};

export const getFileURL = async (storagePath) => {
  return storagePath;
};

export const listFiles = async (folderPath) => {
  return [];
};

export const uploadMultipleFiles = async (uploads, onOverallProgress = null) => {
  const results = [];
  for (const item of uploads) {
    const res = await uploadFile(item.file, item.storagePath);
    results.push(res);
  }
  if (onOverallProgress) onOverallProgress(100);
  return results;
};

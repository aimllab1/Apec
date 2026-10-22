/**
 * Persistent Storage & File Upload Utility
 * Uploads assets directly to /api/upload and returns permanent server URLs.
 * Provides fallback to base64 Data URLs when offline or running client-only.
 */

/**
 * Uploads a single file (image or PDF document) to the server.
 * @param {File|Blob} file - The file to upload.
 * @param {string} storageFolder - Optional target folder name (e.g. 'Faculty', 'Hero', 'Labs', 'Documents').
 * @param {function} [onProgress] - Optional callback for upload progress (percent).
 * @returns {Promise<{downloadURL: string, storagePath: string, fileName: string, fileSize: number, fileType: string}>}
 */
export const uploadFile = async (file, storageFolder = 'Uploads', onProgress = null) => {
  if (onProgress) onProgress(20);

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onerror = () => {
      if (onProgress) onProgress(100);
      resolve({
        downloadURL: URL.createObjectURL(file),
        storagePath: `${storageFolder}/${file?.name || 'file'}`,
        fileName: file?.name || 'file',
        fileSize: file?.size || 0,
        fileType: file?.type || 'application/octet-stream'
      });
    };

    reader.onloadend = async () => {
      const dataUrl = reader.result;
      if (onProgress) onProgress(60);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: file.name || `file_${Date.now()}`,
            dataUrl,
            folder: storageFolder
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (onProgress) onProgress(100);
          resolve({
            downloadURL: data.url || dataUrl,
            storagePath: `${storageFolder}/${data.fileName || file.name}`,
            fileName: data.fileName || file.name,
            fileSize: data.fileSize || file.size,
            fileType: data.mimeType || file.type
          });
          return;
        }
      } catch (err) {
        console.warn('[Storage] Server upload fallback to dataUrl:', err.message);
      }

      // Offline / client-side fallback
      if (onProgress) onProgress(100);
      resolve({
        downloadURL: dataUrl,
        storagePath: `${storageFolder}/${file?.name || 'file'}`,
        fileName: file?.name || 'file',
        fileSize: file?.size || 0,
        fileType: file?.type || 'application/octet-stream'
      });
    };

    reader.readAsDataURL(file);
  });
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
  const total = uploads.length || 1;
  let completed = 0;

  for (const item of uploads) {
    const res = await uploadFile(item.file, item.storagePath || 'Uploads');
    results.push(res);
    completed++;
    if (onOverallProgress) onOverallProgress(Math.round((completed / total) * 100));
  }
  return results;
};

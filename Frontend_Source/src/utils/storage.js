import { 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
  deleteObject, 
  listAll 
} from "firebase/storage";
import { storage } from "../firebase";

/**
 * Uploads a single file to Firebase Storage with progress tracking and retry logic.
 * @param {File|Blob} file - The file to upload.
 * @param {string} storagePath - The target path in Firebase Storage (e.g., 'storage/Images/College/pic.jpg').
 * @param {function} [onProgress] - Optional callback for upload progress (percent).
 * @param {object} [metadata] - Optional custom metadata.
 * @param {number} [maxRetries=3] - Number of retry attempts for failed uploads.
 * @returns {Promise<{downloadURL: string, storagePath: string, fileName: string, fileSize: number, fileType: string}>}
 */
export const uploadFile = (file, storagePath, onProgress = null, metadata = {}, maxRetries = 3) => {
  return new Promise((resolve, reject) => {
    // Ensure the storage path is formatted correctly
    const cleanPath = storagePath.startsWith("/") ? storagePath.slice(1) : storagePath;
    const storageRef = ref(storage, cleanPath);
    
    // Set custom metadata if any
    const uploadTask = uploadBytesResumable(storageRef, file, { customMetadata: metadata });

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (onProgress) {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress(Math.round(progress));
        }
      },
      async (error) => {
        if (maxRetries > 0) {
          console.warn(`Upload failed for ${cleanPath}. Retrying... (${maxRetries} attempts left). Error:`, error);
          try {
            const retryResult = await uploadFile(file, cleanPath, onProgress, metadata, maxRetries - 1);
            resolve(retryResult);
          } catch (retryError) {
            reject(retryError);
          }
        } else {
          console.error(`Upload failed after all retries for ${cleanPath}:`, error);
          reject(error);
        }
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            downloadURL,
            storagePath: cleanPath,
            fileName: file.name || cleanPath.split("/").pop(),
            fileSize: file.size,
            fileType: file.type || "application/octet-stream"
          });
        } catch (urlError) {
          reject(urlError);
        }
      }
    );
  });
};

/**
 * Deletes a file from Firebase Storage.
 * @param {string} storagePath - The path of the file in Storage.
 * @returns {Promise<void>}
 */
export const deleteFile = async (storagePath) => {
  const cleanPath = storagePath.startsWith("/") ? storagePath.slice(1) : storagePath;
  const storageRef = ref(storage, cleanPath);
  try {
    await deleteObject(storageRef);
  } catch (error) {
    console.error(`Failed to delete file at ${cleanPath}:`, error);
    throw error;
  }
};

/**
 * Gets the download URL for a file in Firebase Storage.
 * @param {string} storagePath - The path of the file in Storage.
 * @returns {Promise<string>}
 */
export const getFileURL = async (storagePath) => {
  const cleanPath = storagePath.startsWith("/") ? storagePath.slice(1) : storagePath;
  const storageRef = ref(storage, cleanPath);
  try {
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error(`Failed to get download URL for ${cleanPath}:`, error);
    throw error;
  }
};

/**
 * Lists all files in a specific directory in Firebase Storage.
 * @param {string} folderPath - The directory path in Storage.
 * @returns {Promise<import("firebase/storage").StorageReference[]>}
 */
export const listFiles = async (folderPath) => {
  const cleanPath = folderPath.startsWith("/") ? folderPath.slice(1) : folderPath;
  const folderRef = ref(storage, cleanPath);
  try {
    const res = await listAll(folderRef);
    return res.items;
  } catch (error) {
    console.error(`Failed to list files in ${cleanPath}:`, error);
    throw error;
  }
};

/**
 * Uploads multiple files in parallel.
 * @param {Array<{file: File|Blob, storagePath: string, metadata?: object}>} uploads - Array of objects with file and path info.
 * @param {function} [onOverallProgress] - Optional callback for overall progress (average percent).
 * @returns {Promise<Array<{downloadURL: string, storagePath: string, fileName: string, fileSize: number, fileType: string}>>}
 */
export const uploadMultipleFiles = async (uploads, onOverallProgress = null) => {
  const totalFiles = uploads.length;
  if (totalFiles === 0) return [];

  const progresses = new Array(totalFiles).fill(0);
  const triggerOverallProgress = () => {
    if (onOverallProgress) {
      const avgProgress = progresses.reduce((sum, p) => sum + p, 0) / totalFiles;
      onOverallProgress(Math.round(avgProgress));
    }
  };

  const uploadPromises = uploads.map((item, index) => {
    return uploadFile(
      item.file,
      item.storagePath,
      (percent) => {
        progresses[index] = percent;
        triggerOverallProgress();
      },
      item.metadata || {}
    );
  });

  return Promise.all(uploadPromises);
};

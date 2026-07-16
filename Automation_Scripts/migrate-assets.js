import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const logFilePath = path.resolve(projectRoot, 'migration.log');

// Initialize/clear log file
fs.writeFileSync(logFilePath, `=== Asset Migration Log - Started at ${new Date().toLocaleString()} ===\n\n`);

function log(msg) {
  console.log(msg);
  try {
    fs.appendFileSync(logFilePath, msg + '\n');
  } catch (err) {
    // Ignore logging errors
  }
}

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate config
if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.storageBucket) {
  log("Error: Firebase configuration missing in environment variables (.env).");
  log("Please ensure you have configured .env correctly.");
  process.exit(1);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

/**
 * Handles Firebase Authentication if credentials are provided in .env.
 */
async function authenticate() {
  const email = process.env.VITE_FIREBASE_AUTH_EMAIL;
  const password = process.env.VITE_FIREBASE_AUTH_PASSWORD;

  if (email && password) {
    const auth = getAuth(app);
    log(`Authenticating as ${email}...`);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      log("Authentication successful.");
    } catch (error) {
      log(`Authentication failed: ${error.message}`);
      process.exit(1);
    }
  } else {
    log("No auth credentials found. Proceeding without authentication.");
    log("Ensure your Firebase Security Rules allow writes for this migration.");
  }
}

/**
 * Determines the target Firebase Storage path preserving standard structure.
 */
function getCleanStoragePath(localFullPath) {
  const relativePath = path.relative(projectRoot, localFullPath).replace(/\\/g, '/');

  if (relativePath.startsWith('Media_Assets/')) {
    return 'storage/' + relativePath.substring('Media_Assets/'.length);
  }
  if (relativePath.startsWith('Frontend_Source/src/assets/')) {
    return 'storage/assets/' + relativePath.substring('Frontend_Source/src/assets/'.length);
  }
  if (relativePath.startsWith('Frontend_Source/src/library_files/')) {
    return 'storage/library_files/' + relativePath.substring('Frontend_Source/src/library_files/'.length);
  }
  if (relativePath.startsWith('Frontend_Source/src/')) {
    return 'storage/src/' + relativePath.substring('Frontend_Source/src/'.length);
  }
  return 'storage/' + relativePath;
}

/**
 * Determines the client-side lookup key that matches path syntax in React components.
 */
function getClientLookupKey(localFullPath) {
  const relativePath = path.relative(projectRoot, localFullPath).replace(/\\/g, '/');

  if (relativePath.startsWith('Media_Assets/')) {
    return '/' + relativePath.substring('Media_Assets/'.length);
  }
  if (relativePath.startsWith('Frontend_Source/src/assets/')) {
    return 'src/assets/' + relativePath.substring('Frontend_Source/src/assets/'.length);
  }
  if (relativePath.startsWith('Frontend_Source/src/library_files/')) {
    return 'src/library_files/' + relativePath.substring('Frontend_Source/src/library_files/'.length);
  }
  if (relativePath.startsWith('Frontend_Source/src/')) {
    return 'src/' + relativePath.substring('Frontend_Source/src/'.length);
  }
  return relativePath;
}

/**
 * Classifies files into categories for Firestore.
 */
function getCategory(storagePath) {
  const lowerPath = storagePath.toLowerCase();
  if (lowerPath.includes('/panorama/')) return 'panoramas';
  if (lowerPath.endsWith('.pdf')) return 'pdfs';
  if (lowerPath.endsWith('.mp4') || lowerPath.endsWith('.webm') || lowerPath.endsWith('.ogg')) return 'videos';
  if (lowerPath.match(/\.(jpg|jpeg|png|webp|gif|svg|avif)$/)) return 'images';
  return 'others';
}

/**
 * Scans directories recursively to fetch all file paths.
 */
function getFilesRecursively(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursively(filePath, fileList);
    } else {
      if (file !== 'Thumbs.db' && !file.startsWith('.')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

/**
 * Compresses and converts images to WebP using sharp unless it's a panorama.
 */
async function getUploadBuffer(filePath, storagePath) {
  const ext = path.extname(filePath).toLowerCase();
  const fileBuffer = fs.readFileSync(filePath);

  const isPanorama = storagePath.toLowerCase().includes('/panorama/');
  const isImage = ext.match(/\.(jpg|jpeg|png)$/i);

  if (isImage && !isPanorama) {
    log(`Optimizing and converting ${path.basename(filePath)} to WebP...`);
    try {
      const webpBuffer = await sharp(fileBuffer)
        .webp({ quality: 80 })
        .toBuffer();
      
      const newStoragePath = storagePath.replace(new RegExp(`${ext}$`, 'i'), '.webp');
      return {
        buffer: webpBuffer,
        mimeType: 'image/webp',
        storagePath: newStoragePath,
        optimized: true
      };
    } catch (err) {
      log(`Could not optimize ${path.basename(filePath)}, uploading original. Error: ${err.message}`);
    }
  }

  let mimeType = 'application/octet-stream';
  if (ext === '.pdf') mimeType = 'application/pdf';
  else if (ext === '.mp4') mimeType = 'video/mp4';
  else if (ext === '.webm') mimeType = 'video/webm';
  else if (ext === '.webp') mimeType = 'image/webp';
  else if (ext === '.png') mimeType = 'image/png';
  else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
  else if (ext === '.svg') mimeType = 'image/svg+xml';
  else if (ext === '.avif') mimeType = 'image/avif';

  return {
    buffer: fileBuffer,
    mimeType,
    storagePath,
    optimized: false
  };
}

/**
 * Main migration controller function.
 */
async function runMigration() {
  await authenticate();

  log("Scanning local assets...");
  const filesToUpload = [];

  // Scan Media_Assets
  const mediaAssetsDir = path.resolve(projectRoot, 'Media_Assets');
  getFilesRecursively(mediaAssetsDir, filesToUpload);

  // Scan Frontend_Source/src/assets
  const srcAssetsDir = path.resolve(projectRoot, 'Frontend_Source/src/assets');
  getFilesRecursively(srcAssetsDir, filesToUpload);

  // Scan Frontend_Source/src/library_files
  const srcLibFilesDir = path.resolve(projectRoot, 'Frontend_Source/src/library_files');
  getFilesRecursively(srcLibFilesDir, filesToUpload);

  // Scan direct assets in Frontend_Source/src
  const directSrcFiles = [
    'administrative officer.jpg',
    'Arulthiru Bangaru Sidhar.jpg',
    'bg_loop.mp4',
    'Dean.webp',
    'principal.webp',
    'Sakthi Thiru. Dr. G. B. Senthil Kumar.jpeg',
    'Sakthi Tmt. V. Lakshmi Bangaru Sidhar.jpeg',
    'Vice principal.jpg'
  ].map(file => path.resolve(projectRoot, 'Frontend_Source/src', file));

  for (const filePath of directSrcFiles) {
    if (fs.existsSync(filePath)) {
      filesToUpload.push(filePath);
    }
  }

  log(`Found ${filesToUpload.length} files to process.`);

  const manifest = {};
  let successCount = 0;
  let failCount = 0;
  const skippedList = [];

  for (let i = 0; i < filesToUpload.length; i++) {
    const filePath = filesToUpload[i];
    const originalStoragePath = getCleanStoragePath(filePath);
    const clientKey = getClientLookupKey(filePath);

    log(`\n[${i + 1}/${filesToUpload.length}] Processing: ${path.basename(filePath)}`);
    log(`- Local Path: ${filePath}`);
    log(`- Client Lookup Key: ${clientKey}`);

    try {
      const { buffer, mimeType, storagePath, optimized } = await getUploadBuffer(filePath, originalStoragePath);
      log(`- Target Storage Path: ${storagePath}`);
      log(`- Content-Type: ${mimeType}`);
      log(`- Size: ${(buffer.length / 1024).toFixed(2)} KB`);

      // Upload file to Firebase Storage
      const storageRef = ref(storage, storagePath);
      const metadata = {
        contentType: mimeType,
        customMetadata: {
          originalName: path.basename(filePath),
          optimized: optimized ? "true" : "false",
          localPath: clientKey
        }
      };

      await uploadBytes(storageRef, buffer, metadata);
      const downloadURL = await getDownloadURL(storageRef);
      log(`- Upload complete. URL: ${downloadURL}`);

      // Store in Firestore
      const category = getCategory(storagePath);
      const fileMeta = {
        fileName: path.basename(storagePath),
        category,
        downloadURL,
        storagePath,
        fileSize: buffer.length,
        fileType: mimeType,
        uploadedAt: new Date().toISOString(),
        localPath: clientKey
      };

      const docId = storagePath.replace(/\//g, '__');
      await setDoc(doc(db, 'assets', docId), fileMeta);
      log(`- Metadata saved in Firestore (assets/${docId})`);

      // Store mapping in manifest
      manifest[clientKey] = downloadURL;

      if (clientKey.startsWith('/')) {
        manifest[clientKey.substring(1)] = downloadURL;
      }

      successCount++;
    } catch (err) {
      log(`- Error processing ${path.basename(filePath)}: ${err.message}`);
      failCount++;
      skippedList.push({ file: filePath, error: err.message });
    }
  }

  // Upload Manifest Document
  if (Object.keys(manifest).length > 0) {
    log("\nUploading Manifest file mapping to Firestore (manifests/assets)...");
    try {
      await setDoc(doc(db, 'manifests', 'assets'), manifest);
      log("Manifest successfully uploaded to Firestore!");
    } catch (err) {
      log(`Failed to upload manifest to Firestore: ${err.message}`);
    }
  }

  log(`\n=== Migration Summary ===`);
  log(`Success: ${successCount}`);
  log(`Failed: ${failCount}`);
  if (failCount > 0) {
    log("Failed Files list:");
    log(JSON.stringify(skippedList, null, 2));
  }
}

runMigration().catch(err => {
  log(`Fatal Migration Error: ${err.message}`);
});

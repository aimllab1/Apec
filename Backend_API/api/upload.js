import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configure Cloudinary from environment variables or hardcoded fallback
const cloud_name = process.env.CLOUDINARY_CLOUD_NAME || 'o1hw2rfp';
const api_key = process.env.CLOUDINARY_API_KEY || '485976653673534';
const api_secret = process.env.CLOUDINARY_API_SECRET || 'BEIUxiKq7b92TZy2DbPYQrjHveo';

cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
  secure: true
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    const { filename, dataUrl, folder = 'Uploads' } = body;
    if (!dataUrl || !filename) {
      return res.status(400).json({ error: 'Missing filename or dataUrl' });
    }

    // Determine target folder in Cloudinary (e.g. apec/Faculty)
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '_');
    const cloudinaryFolder = `apec/${sanitizedFolder}`;

    // Clean public_id without extension
    const baseName = filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9._-]/g, '_');
    const publicId = `${Date.now()}_${baseName}`;

    // Upload directly to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(dataUrl, {
      folder: cloudinaryFolder,
      public_id: publicId,
      resource_type: 'auto',
      overwrite: true
    });

    console.log(`[Upload API] Uploaded to Cloudinary: ${uploadResult.secure_url}`);

    return res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      fileName: filename,
      fileSize: uploadResult.bytes,
      mimeType: uploadResult.format,
      public_id: uploadResult.public_id
    });
  } catch (err) {
    console.error('[Upload API Error]:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

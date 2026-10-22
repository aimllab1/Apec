import fs from 'fs';
import path from 'path';

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

    const matches = dataUrl.match(/^data:([A-Za-z0-9-+\/.]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return res.status(400).json({ error: 'Invalid base64 data URL format' });
    }

    const mimeType = matches[1];
    const fileBuffer = Buffer.from(matches[2], 'base64');
    const sanitizedName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '_');
    const timestamp = Date.now();
    const finalFilename = `${timestamp}_${sanitizedName}`;

    // Target storage directories
    const isPdf = mimeType.includes('pdf') || filename.toLowerCase().endsWith('.pdf');
    const baseCategory = isPdf ? 'Documents' : 'Images';
    const relativeWebPath = `/${baseCategory}/${sanitizedFolder}/${finalFilename}`;

    const targetDirs = [
      path.resolve(process.cwd(), `Media_Assets/${baseCategory}/${sanitizedFolder}`),
      path.resolve(process.cwd(), `public/${baseCategory}/${sanitizedFolder}`)
    ];

    let saved = false;
    for (const dir of targetDirs) {
      try {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        const fullFilePath = path.join(dir, finalFilename);
        fs.writeFileSync(fullFilePath, fileBuffer);
        saved = true;
      } catch (writeErr) {
        console.warn('[Upload API] Target dir write failed:', dir, writeErr.message);
      }
    }

    if (!saved) {
      // Return inline data URL if filesystem write is restricted (e.g. read-only serverless edge)
      return res.status(200).json({
        success: true,
        url: dataUrl,
        fileName: finalFilename,
        isInline: true
      });
    }

    return res.status(200).json({
      success: true,
      url: relativeWebPath,
      fileName: finalFilename,
      fileSize: fileBuffer.length,
      mimeType
    });
  } catch (err) {
    console.error('[Upload API Error]:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

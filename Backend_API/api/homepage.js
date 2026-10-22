import fs from 'fs';
import path from 'path';

function getHomePath() {
  const possiblePaths = [
    path.resolve(process.cwd(), 'Frontend_Source/src/data/homeData.json'),
    path.resolve(process.cwd(), 'src/data/homeData.json'),
    path.resolve(process.cwd(), 'College_Data/data/homeData.json')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const homeFilePath = getHomePath();

  if (req.method === 'GET') {
    try {
      if (fs.existsSync(homeFilePath)) {
        const raw = fs.readFileSync(homeFilePath, 'utf-8');
        return res.status(200).json(JSON.parse(raw));
      }
      return res.status(404).json({ error: 'homeData.json not found' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'POST') {
    try {
      let body = req.body;
      if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (e) {}
      }
      body = body || {};

      const dir = path.dirname(homeFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(homeFilePath, JSON.stringify(body, null, 2), 'utf-8');
      return res.status(200).json({ success: true, message: 'Home page configuration saved' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

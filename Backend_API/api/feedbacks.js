import fs from 'fs';
import path from 'path';

let inMemoryFeedbacks = [];

function getFeedbacksPath() {
  const possiblePaths = [
    path.resolve(process.cwd(), 'College_Data/data/feedbacks.json'),
    path.resolve(process.cwd(), 'College_Data/feedbacks.json'),
    path.resolve(process.cwd(), 'Backend_API/feedbacks.json')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function loadFeedbacks() {
  const filePath = getFeedbacksPath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        inMemoryFeedbacks = data;
        return inMemoryFeedbacks;
      }
    }
  } catch (err) {
    console.warn('[Feedbacks API] Could not read file, using memory store:', err.message);
  }
  return inMemoryFeedbacks;
}

function saveFeedbacks(items) {
  inMemoryFeedbacks = items;
  const filePath = getFeedbacksPath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Feedbacks API] Could not write file, using memory store:', err.message);
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const { dept } = req.query || {};
    let data = loadFeedbacks();
    if (dept && dept !== 'all') {
      data = data.filter(item => String(item.departmentKey || item.dept).toLowerCase() === String(dept).toLowerCase());
    }
    return res.status(200).json({ feedbacks: data });
  }

  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    const feedbacks = loadFeedbacks();
    const newFeedback = {
      id: body.id || `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: body.name || 'Anonymous User',
      email: body.email || '',
      phone: body.phone || '',
      category: body.category || 'General',
      message: body.message || body.feedback || '',
      department: body.department || '',
      departmentKey: body.departmentKey || body.deptKey || '',
      rating: body.rating || 5,
      date: body.date || new Date().toLocaleString(),
      createdAt: Date.now()
    };

    feedbacks.unshift(newFeedback);
    saveFeedbacks(feedbacks);
    return res.status(200).json({ success: true, feedback: newFeedback });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query || {};
    if (!id) {
      return res.status(400).json({ error: 'Missing feedback ID' });
    }
    const feedbacks = loadFeedbacks();
    const filtered = feedbacks.filter(item => String(item.id) !== String(id));
    saveFeedbacks(filtered);
    return res.status(200).json({ success: true, message: 'Feedback deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

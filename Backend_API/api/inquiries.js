import fs from 'fs';
import path from 'path';

// Memory fallback store (for serverless environments without persistent FS)
let inMemoryInquiries = [];

function getFilePath() {
  const possiblePaths = [
    path.resolve(process.cwd(), 'College_Data/data/inquiries.json'),
    path.resolve(process.cwd(), 'College_Data/inquiries.json'),
    path.resolve(process.cwd(), 'Backend_API/inquiries.json'),
    path.resolve(process.cwd(), 'inquiries.json')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function loadInquiries() {
  const filePath = getFilePath();
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) {
        inMemoryInquiries = data;
        return inMemoryInquiries;
      }
    }
  } catch (err) {
    console.warn('[Inquiries API] Could not read from file, using memory store:', err.message);
  }
  return inMemoryInquiries;
}

function saveInquiries(items) {
  inMemoryInquiries = items;
  const filePath = getFilePath();
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Inquiries API] Could not write to file, kept in memory store:', err.message);
  }
}

export default async function handler(req, res) {
  // CORS Headers for multi-device & cross-origin support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET: Fetch inquiries list
  if (req.method === 'GET') {
    const data = loadInquiries();
    return res.status(200).json({ inquiries: data });
  }

  // 2. POST: Add inquiry or update inquiry
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (e) {}
    }
    body = body || {};

    const inquiries = loadInquiries();

    // Check for update action
    if (body.action === 'update_status' && body.id) {
      const updated = inquiries.map(item => 
        String(item.id) === String(body.id) ? { ...item, status: body.status } : item
      );
      saveInquiries(updated);
      return res.status(200).json({ success: true, message: 'Status updated' });
    }

    if (body.action === 'update_notes' && body.id) {
      const updated = inquiries.map(item => 
        String(item.id) === String(body.id) ? { ...item, notes: body.notes } : item
      );
      saveInquiries(updated);
      return res.status(200).json({ success: true, message: 'Notes updated' });
    }

    // Default: Add new inquiry record
    const newInquiry = {
      id: body.id || `inq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: body.name || 'Anonymous Applicant',
      phone: body.phone || body.contactNumber || '',
      cutoff: body.cutoff || '',
      dept: body.dept || body.department || '',
      email: body.email || '',
      source: body.source || 'Website Admission Popup',
      status: body.status || 'New',
      notes: body.notes || '',
      maths: body.maths || null,
      physics: body.physics || null,
      chemistry: body.chemistry || null,
      schoolName: body.schoolName || '',
      board: body.board || '',
      yearOfPassing: body.yearOfPassing || '',
      date: body.date || new Date().toLocaleString(),
      createdAt: body.createdAt || Date.now()
    };

    // Prepend to inquiries list (avoiding duplicate ID)
    const filtered = inquiries.filter(item => String(item.id) !== String(newInquiry.id));
    const updated = [newInquiry, ...filtered];
    saveInquiries(updated);

    return res.status(200).json({ success: true, inquiry: newInquiry });
  }

  // 3. DELETE: Remove single inquiry or purge all
  if (req.method === 'DELETE') {
    let urlId = null;
    let purgeAll = false;

    if (req.query) {
      urlId = req.query.id;
      purgeAll = req.query.all === 'true';
    }

    // Fallback if query not parsed by custom server
    if (!urlId && !purgeAll && req.url && req.url.includes('?')) {
      const params = new URLSearchParams(req.url.split('?')[1]);
      urlId = params.get('id');
      purgeAll = params.get('all') === 'true';
    }

    if (purgeAll) {
      saveInquiries([]);
      return res.status(200).json({ success: true, message: 'All inquiries purged' });
    }

    if (urlId) {
      const inquiries = loadInquiries();
      const updated = inquiries.filter(item => String(item.id) !== String(urlId));
      saveInquiries(updated);
      return res.status(200).json({ success: true, message: 'Inquiry deleted' });
    }

    return res.status(400).json({ error: 'Missing inquiry id or all parameter' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

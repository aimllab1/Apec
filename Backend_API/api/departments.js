import fs from 'fs';
import path from 'path';

function getDeptsPath() {
  const possiblePaths = [
    path.resolve(process.cwd(), 'Frontend_Source/src/data/departmentsData.json'),
    path.resolve(process.cwd(), 'src/data/departmentsData.json'),
    path.resolve(process.cwd(), 'College_Data/data/departmentsData.json')
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) return p;
  }
  return possiblePaths[0];
}

function getFacultyPath() {
  const possiblePaths = [
    path.resolve(process.cwd(), 'Frontend_Source/src/ai/knowledge/faculty.json'),
    path.resolve(process.cwd(), 'src/ai/knowledge/faculty.json')
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

  const deptsFilePath = getDeptsPath();

  if (req.method === 'GET') {
    try {
      if (fs.existsSync(deptsFilePath)) {
        const raw = fs.readFileSync(deptsFilePath, 'utf-8');
        return res.status(200).json(JSON.parse(raw));
      }
      return res.status(404).json({ error: 'departmentsData.json not found' });
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

      const dir = path.dirname(deptsFilePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(deptsFilePath, JSON.stringify(body, null, 2), 'utf-8');

      // Keep faculty.json synchronized with updated department faculty lists
      try {
        const facultyFilePath = getFacultyPath();
        const allFaculty = [];
        Object.values(body).forEach(dept => {
          if (dept && Array.isArray(dept.faculty)) {
            dept.faculty.forEach(fac => {
              allFaculty.push({
                name: fac.name || '',
                designation: fac.designation || '',
                qualification: fac.qualification || '',
                email: fac.email || '',
                experience: fac.experience || '',
                department: fac.department || dept.name || '',
                department_key: fac.department_key || dept.key || '',
                orcid: fac.orcid || '',
                image: fac.image || ''
              });
            });
          }
        });

        if (allFaculty.length > 0) {
          const facDir = path.dirname(facultyFilePath);
          if (!fs.existsSync(facDir)) {
            fs.mkdirSync(facDir, { recursive: true });
          }
          fs.writeFileSync(facultyFilePath, JSON.stringify(allFaculty, null, 2), 'utf-8');
        }
      } catch (facErr) {
        console.warn('[Departments API] Faculty sync warning:', facErr.message);
      }

      return res.status(200).json({ success: true, message: 'Departments and faculty updated successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

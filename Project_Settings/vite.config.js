import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { pathToFileURL, fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('[Vite Config] __dirname:', __dirname)
console.log('[Vite Config] Resolved root:', path.resolve(__dirname, '..'))

// Session store lives at server level — survives module reloads
const sessionStore = new Map();

// Handler cache: only reimport api/chat.js when the file actually changes
let cachedHandler = null;
let cachedMtime = 0;

async function getHandler() {
  const fullPath = path.resolve(process.cwd(), 'Backend_API/api/chat.js');
  try {
    const { mtimeMs } = fs.statSync(fullPath);
    if (!cachedHandler || mtimeMs > cachedMtime) {
      console.log('[Vite API] Reloading Backend_API/api/chat.js (file changed)');
      const url = pathToFileURL(fullPath).href + `?t=${Date.now()}`;
      const mod = await import(/* @vite-ignore */ url);
      cachedHandler = mod.default;
      cachedMtime = mtimeMs;
    }
  } catch (e) {
    console.error('[Vite API] Failed to load handler:', e.message);
  }
  return cachedHandler;
}

// Handler cache for inquiries API
let cachedInquiriesHandler = null;
let cachedInquiriesMtime = 0;

async function getInquiriesHandler() {
  const fullPath = path.resolve(process.cwd(), 'Backend_API/api/inquiries.js');
  try {
    const { mtimeMs } = fs.statSync(fullPath);
    if (!cachedInquiriesHandler || mtimeMs > cachedInquiriesMtime) {
      console.log('[Vite API] Reloading Backend_API/api/inquiries.js (file changed)');
      const url = pathToFileURL(fullPath).href + `?t=${Date.now()}`;
      const mod = await import(/* @vite-ignore */ url);
      cachedInquiriesHandler = mod.default;
      cachedInquiriesMtime = mtimeMs;
    }
  } catch (e) {
    console.error('[Vite API] Failed to load inquiries handler:', e.message);
  }
  return cachedInquiriesHandler;
}

// Create a fresh session object
function createSession() {
  return {
    turns: [],
    lastDepartment: null,
    lastTopic: null,
    lastDocId: null,
    turnCount: 0,
    createdAt: Date.now(),
    lastActivity: Date.now()
  };
}

export default defineConfig({
  root: path.resolve(__dirname, '..'),
  publicDir: path.resolve(__dirname, '../Media_Assets'),
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, '../Media_Assets'),
      '@babel/runtime/helpers/esm/extends': path.resolve(__dirname, 'extends-shim.js')
    },
  },
  build: {
    emptyOutDir: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, '../index.html')
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'vendor-framer-motion';
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // Handle /api/departments (Network central data persistence for departments & faculty)
          if (req.url && req.url.startsWith('/api/departments')) {
            const deptsFilePath = path.resolve(__dirname, '../Frontend_Source/src/data/departmentsData.json');
            const facultyFilePath = path.resolve(__dirname, '../Frontend_Source/src/ai/knowledge/faculty.json');
            if (req.method === 'GET') {
              try {
                if (fs.existsSync(deptsFilePath)) {
                  const content = fs.readFileSync(deptsFilePath, 'utf-8');
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(content);
                } else {
                  res.statusCode = 404;
                  res.end(JSON.stringify({ error: 'departmentsData.json not found' }));
                }
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
              return;
            } else if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const parsed = JSON.parse(body);
                  fs.writeFileSync(deptsFilePath, JSON.stringify(parsed, null, 2), 'utf-8');
                  console.log('[Vite API] Successfully wrote updated departmentsData.json to disk!');

                  // Extract all faculty members to keep faculty.json in sync
                  try {
                    const allFaculty = [];
                    Object.values(parsed).forEach(dept => {
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
                            orcid: fac.orcid || ''
                          });
                        });
                      }
                    });
                    if (allFaculty.length > 0) {
                      fs.writeFileSync(facultyFilePath, JSON.stringify(allFaculty, null, 2), 'utf-8');
                      console.log('[Vite API] Successfully synced faculty.json!');
                    }
                  } catch (facErr) {
                    console.warn('[Vite API] Faculty sync warning:', facErr.message);
                  }

                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true, message: 'Departments data synced to server' }));
                } catch (err) {
                  console.error('[Departments API Error]:', err.message);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }
          }

          // Handle /api/homepage (Home page customizable content persistence)
          if (req.url && req.url.startsWith('/api/homepage')) {
            const homeFilePath = path.resolve(__dirname, '../Frontend_Source/src/data/homeData.json');
            if (req.method === 'GET') {
              try {
                if (fs.existsSync(homeFilePath)) {
                  const content = fs.readFileSync(homeFilePath, 'utf-8');
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(content);
                } else {
                  res.statusCode = 404;
                  res.end(JSON.stringify({ error: 'homeData.json not found' }));
                }
              } catch (err) {
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              }
              return;
            } else if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const parsed = JSON.parse(body);
                  fs.writeFileSync(homeFilePath, JSON.stringify(parsed, null, 2), 'utf-8');
                  console.log('[Vite API] Successfully wrote updated homeData.json to disk!');
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true, message: 'Home data synced to server' }));
                } catch (err) {
                  console.error('[Home API Error]:', err.message);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }
          }

          // Handle /api/upload and /api/upload-image (Save uploaded assets directly to Media_Assets)
          if (req.url && (req.url.startsWith('/api/upload-image') || req.url.startsWith('/api/upload'))) {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', () => {
                try {
                  const { filename, dataUrl, folder = 'Uploads' } = JSON.parse(body);
                  if (!dataUrl || !filename) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Missing filename or dataUrl' }));
                    return;
                  }

                  const matches = dataUrl.match(/^data:([A-Za-z0-9-+\/.]+);base64,(.+)$/);
                  if (!matches || matches.length !== 3) {
                    res.statusCode = 400;
                    res.end(JSON.stringify({ error: 'Invalid data URL format' }));
                    return;
                  }

                  const mimeType = matches[1];
                  const imageBuffer = Buffer.from(matches[2], 'base64');
                  const sanitizedName = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
                  const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '_');
                  const isPdf = mimeType.includes('pdf') || filename.toLowerCase().endsWith('.pdf');
                  const baseCat = isPdf ? 'Documents' : 'Images';
                  
                  const targetDir = path.resolve(__dirname, `../Media_Assets/${baseCat}/${sanitizedFolder}`);
                  if (!fs.existsSync(targetDir)) {
                    fs.mkdirSync(targetDir, { recursive: true });
                  }

                  const finalFilename = `${Date.now()}_${sanitizedName}`;
                  const finalFilePath = path.join(targetDir, finalFilename);
                  fs.writeFileSync(finalFilePath, imageBuffer);

                  const publicUrl = `/${baseCat}/${sanitizedFolder}/${finalFilename}`;
                  console.log(`[Vite API] Saved uploaded file to: ${finalFilePath} -> ${publicUrl}`);

                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 200;
                  res.end(JSON.stringify({ success: true, url: publicUrl, fileName: finalFilename, message: 'File uploaded successfully' }));
                } catch (err) {
                  console.error('[Upload API Error]:', err.message);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
              return;
            }
          }

          // Handle /api/inquiries
          if (req.url && req.url.startsWith('/api/inquiries')) {
            const inquiriesHandler = await getInquiriesHandler();
            if (inquiriesHandler) {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const parsedBody = body ? JSON.parse(body) : {};
                  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
                  const query = Object.fromEntries(urlObj.searchParams.entries());

                  const vercelReq = {
                    body: parsedBody,
                    query,
                    url: req.url,
                    method: req.method,
                    headers: req.headers
                  };
                  const vercelRes = {
                    setHeader(key, val) { res.setHeader(key, val); return this; },
                    status(code) { res.statusCode = code; return this; },
                    end(data) { res.end(data); return this; },
                    json(data) {
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(data));
                    }
                  };
                  await inquiriesHandler(vercelReq, vercelRes);
                } catch (err) {
                  console.error('[Inquiries API Error]:', err.message);
                  res.statusCode = 500;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Server error processing inquiry' }));
                }
              });
              return;
            }
          }

          // Handle /api/chat
          if (req.url && req.url.startsWith('/api/chat')) {
            if (req.method === 'POST') {
              let body = '';
              req.on('data', chunk => { body += chunk; });
              req.on('end', async () => {
                try {
                  const parsedBody = JSON.parse(body || '{}');
                  const sessionId = parsedBody.sessionId || 'default';

                  // Get or create session for this user
                  if (!sessionStore.has(sessionId)) {
                    sessionStore.set(sessionId, createSession());
                  }
                  const session = sessionStore.get(sessionId);

                  // Get handler (cached, only reloads when api/chat.js changes)
                  const handler = await getHandler();
                  if (!handler) throw new Error('Handler not loaded');

                  const vercelReq = {
                    // Pass session by reference so mutations persist in sessionStore
                    body: { ...parsedBody, session },
                    method: req.method,
                    headers: req.headers
                  };
                  const vercelRes = {
                    setHeader(key, val) { res.setHeader(key, val); return this; },
                    status(code) { res.statusCode = code; return this; },
                    end(data) { res.end(data); return this; },
                    json(data) {
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify(data));
                    }
                  };

                  await handler(vercelReq, vercelRes);
                } catch (err) {
                  console.error('[API Error]:', err.message);
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    response: "I'm having trouble right now. Please try again or call APEC: +91 7418064336"
                  }));
                }
              });
              return;
            }
          }
          next();
        });
      }
    }
  ],
  server: {
    host: true,
    allowedHosts: true,
    watch: {
      usePolling: true,
      ignored: ['**/.env', '**/vite.config.js']
    },
  },
  preview: {
    host: true,
    allowedHosts: true,
  },
  optimizeDeps: {
    entries: ['index.html'],
  },
})

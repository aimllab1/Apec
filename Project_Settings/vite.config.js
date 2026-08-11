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
    },
  },
  build: {
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
    watch: {
      usePolling: true,
      ignored: ['**/.env', '**/vite.config.js']
    },
  },
  preview: {
    host: true,
  },
  optimizeDeps: {
    entries: ['index.html'],
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'
import { pathToFileURL } from 'url'

// Session store lives at server level — survives module reloads
const sessionStore = new Map();

// Handler cache: only reimport api/chat.js when the file actually changes
let cachedHandler = null;
let cachedMtime = 0;

async function getHandler() {
  const fullPath = path.resolve(process.cwd(), 'api/chat.js');
  try {
    const { mtimeMs } = fs.statSync(fullPath);
    if (!cachedHandler || mtimeMs > cachedMtime) {
      console.log('[Vite API] Reloading api/chat.js (file changed)');
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

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
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
                    status(code) { res.statusCode = code; return this; },
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
    watch: {
      usePolling: true,
      ignored: ['**/.env', '**/vite.config.js']
    },
  },
  optimizeDeps: {
    entries: ['index.html'],
  },
})

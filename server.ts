import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Free Fire player info lookup proxy
app.get('/api/player-info', async (req, res) => {
  try {
    const uid = String(req.query.uid || '').trim();
    const region = String(req.query.region || 'IND').trim().toUpperCase();
    const customKey = req.query.key ? String(req.query.key).trim() : '';

    if (!uid) {
      return res.status(400).json({
        error: 'UID is required. Please provide a valid Free Fire account UID.',
      });
    }

    const apiKey = customKey || process.env.FREE_FIRE_API_KEY || 'shizuka_ff_main_api:FFINFO:G9L';
    const targetUrl = `https://siambhau69.eu.cc/freefireinfo/bhau?uid=${encodeURIComponent(uid)}&region=${encodeURIComponent(region)}&key=${encodeURIComponent(apiKey)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const upstreamResponse = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await upstreamResponse.json().catch(async () => {
      const text = await upstreamResponse.text();
      return { error: text || 'Invalid response from Free Fire API' };
    });

    if (!upstreamResponse.ok || (data && data.error)) {
      return res.status(upstreamResponse.status === 200 ? 404 : upstreamResponse.status).json({
        error: data?.error || `Player UID ${uid} not found in region ${region}. Please check the UID and region.`,
        details: data,
      });
    }

    return res.json(data);
  } catch (err: unknown) {
    const error = err as Error;
    console.error('Error fetching Free Fire player info:', error);
    if (error?.name === 'AbortError') {
      return res.status(504).json({
        error: 'Request timed out while contacting Free Fire game server. Please try again.',
      });
    }
    return res.status(500).json({
      error: 'Failed to retrieve player information. Please try again.',
      message: error?.message,
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

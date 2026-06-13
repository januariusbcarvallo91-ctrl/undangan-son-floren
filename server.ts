/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';
import { createServer as createViteServer } from 'vite';

// Self-contained wish type for the server
interface ServerWish {
  id: string;
  name: string;
  status: 'Hadir' | 'Tidak Hadir';
  wish: string;
  timestamp: string;
}

const PORT = 3000;
const DB_PATH = path.join(process.cwd(), 'wishes-db.json');

// Helper to load wishes from the filesystem, seeding defaults if empty
function fetchWishes(): ServerWish[] {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const seededWishes: ServerWish[] = [
        {
          id: 'seed-1',
          name: 'Pastor Bobby, Pr',
          status: 'Hadir',
          wish: 'Selamat atas Sakramen Pernikahan Suci bagi Son dan Floren. Semoga Kasih Kristus selalu merajai bahtera rumah tangga kalian, membawa damai sejahtera dan berkat melimpah sampai akhir hayat.',
          timestamp: new Date(Date.now() - 3600000 * 20).toISOString()
        },
        {
          id: 'seed-2',
          name: 'Ibu Karlinda Kewa & Keluarga',
          status: 'Hadir',
          wish: 'Turut bersuka cita atas dipersatukannya kedua mempelai. Floren sayang dan Son ganteng, jadilah terang bagi sesama dan pasangan yang terus saling menguatkan dalam ikatan suci ini.',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
        },
        {
          id: 'seed-3',
          name: 'Rofinus Rehi Unarajan',
          status: 'Hadir',
          wish: 'Selamat menempuh hidup baru adikku Son dan istri tercinta Floren. Sukses selalu, semoga cepat diberikan buah hati penggembira rumah tangga.',
          timestamp: new Date(Date.now() - 3600000 * 1).toISOString()
        }
      ];
      fs.writeFileSync(DB_PATH, JSON.stringify(seededWishes, null, 2), 'utf8');
      return seededWishes;
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data) as ServerWish[];
  } catch (error) {
    console.error('Failed to read status database:', error);
    return [];
  }
}

// Helper to append and save a wish
function saveWish(name: string, status: 'Hadir' | 'Tidak Hadir', wish: string): ServerWish {
  const wishes = fetchWishes();
  const newWish: ServerWish = {
    id: `wish-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name,
    status,
    wish,
    timestamp: new Date().toISOString()
  };
  wishes.push(newWish);
  // Keep sorted with newest first in database
  wishes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(wishes, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save to database:', err);
  }
  return newWish;
}

const CONFIG_PATH = path.join(process.cwd(), 'music-config.json');

interface MusicConfig {
  type: 'default' | 'drive' | 'local';
  driveId: string;
}

function loadMusicConfig(): MusicConfig {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const data = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(data) as MusicConfig;
    }
  } catch (err) {
    console.error('Failed to load music config:', err);
  }
  return { type: 'default', driveId: '' };
}

function saveMusicConfig(config: MusicConfig) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save music config:', err);
  }
}

async function startServer() {
  const app = express();

  // Parse JSON payloads
  app.use(express.json());

  // Audio stream dispatcher redirecting directly to public Google Drive file
  app.get('/api/audio', (req, res) => {
    try {
      const driveId = '18EjjagLe1KRtfqBWELEjvTPQjcFsSxpH';
      const driveUrl = `https://docs.google.com/uc?export=download&id=${driveId}`;
      res.redirect(302, driveUrl);
    } catch (err) {
      console.error('Audio stream redirect failed:', err);
      res.status(500).send('Internal Server Error fetching audio');
    }
  });

  // Music config GET route
  app.get('/api/music-config', (req, res) => {
    res.json({ type: 'drive', driveId: '18EjjagLe1KRtfqBWELEjvTPQjcFsSxpH' });
  });

  // Music config POST route
  app.post('/api/music-config', (req, res) => {
    res.json({ success: true, config: { type: 'drive', driveId: '18EjjagLe1KRtfqBWELEjvTPQjcFsSxpH' } });
  });

  // API Endpoints for Wishes
  app.get('/api/wishes', (req, res) => {
    const wishes = fetchWishes();
    res.json(wishes);
  });

  app.post('/api/wishes', (req, res) => {
    const { name, status, wish } = req.body;
    if (!name || !status || !wish) {
      res.status(400).json({ error: 'Missing required state fields: name, status, or wish' });
      return;
    }
    if (status !== 'Hadir' && status !== 'Tidak Hadir') {
      res.status(400).json({ error: 'Status must be Hadir or Tidak Hadir' });
      return;
    }
    const saved = saveWish(name.trim(), status, wish.trim());
    res.status(201).json(saved);
  });

  // Health endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date() });
  });

  // Dev server integration or production assets serve
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
    console.log(`Node applet running in full-stack on http://0.0.0.0:${PORT}`);
  });
}

startServer();

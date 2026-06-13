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

  // Audio stream dispatcher
  app.get('/api/audio', (req, res) => {
    try {
      const config = loadMusicConfig();
      if (config.type === 'local') {
        const preferredPath = path.join(process.cwd(), 'public', 'mari-menua-bersama.mp3');
        const preferredPathRoot = path.join(process.cwd(), 'mari-menua-bersama.mp3');
        const fallbackPath = path.join(process.cwd(), 'public', 'wedding-song.mp3');
        const fallbackPathRoot = path.join(process.cwd(), 'wedding-song.mp3');
        
        if (fs.existsSync(preferredPath)) {
          res.setHeader('Content-Type', 'audio/mpeg');
          return res.sendFile(preferredPath);
        } else if (fs.existsSync(preferredPathRoot)) {
          res.setHeader('Content-Type', 'audio/mpeg');
          return res.sendFile(preferredPathRoot);
        } else if (fs.existsSync(fallbackPath)) {
          res.setHeader('Content-Type', 'audio/mpeg');
          return res.sendFile(fallbackPath);
        } else if (fs.existsSync(fallbackPathRoot)) {
          res.setHeader('Content-Type', 'audio/mpeg');
          return res.sendFile(fallbackPathRoot);
        }
      } else if (config.type === 'drive' && config.driveId) {
        // Direct stream links for public items on Google Drive
        const driveUrl = `https://docs.google.com/uc?export=download&id=${config.driveId}`;
        return res.redirect(302, driveUrl);
      }
      
      // Default placeholder playlist tune (Canon in D)
      const audioUrl = 'https://upload.wikimedia.org/wikipedia/commons/c/c6/Canon_in_D_Major_%28ISRC_USUAN1100301%29.mp3';
      res.redirect(302, audioUrl);
    } catch (err) {
      console.error('Audio stream fetching or redirect failed:', err);
      res.status(500).send('Internal Server Error fetching audio');
    }
  });

  // Music config GET route
  app.get('/api/music-config', (req, res) => {
    res.json(loadMusicConfig());
  });

  // Music config POST route
  app.post('/api/music-config', (req, res) => {
    try {
      const { type, driveId } = req.body;
      if (type !== 'default' && type !== 'drive' && type !== 'local') {
        res.status(400).json({ error: 'Format tipe musik tidak valid' });
        return;
      }
      saveMusicConfig({ type, driveId: driveId || '' });
      res.json({ success: true, config: { type, driveId } });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Gagal menyimpan konfigurasi' });
    }
  });

  // Binary Audio file upload route
  app.post('/api/audio-upload', express.raw({ type: '*/*', limit: '20mb' }), (req, res) => {
    try {
      if (!req.body || req.body.length === 0) {
        res.status(400).json({ error: 'File audio kosong atau tidak terkirim' });
        return;
      }
      const publicDir = path.join(process.cwd(), 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const audioPath = path.join(publicDir, 'mari-menua-bersama.mp3');
      fs.writeFileSync(audioPath, req.body);
      
      saveMusicConfig({ type: 'local', driveId: '' });
      res.json({ success: true, message: 'Lagu berhasil diunggah' });
    } catch (err: any) {
      console.error('Audio upload failed on server:', err);
      res.status(500).json({ error: err.message || 'Gagal menyimpan file audio' });
    }
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

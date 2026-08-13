import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory data store initialized from JSON files
const dataDir = path.join(__dirname, 'client-website', 'shared', 'data');

let products = [];
try {
  const raw = fs.readFileSync(path.join(dataDir, 'products.json'), 'utf-8');
  products = JSON.parse(raw);
} catch (e) {
  products = [];
}

let faq = [];
try {
  const raw = fs.readFileSync(path.join(dataDir, 'faq.json'), 'utf-8');
  faq = JSON.parse(raw);
} catch (e) {
  faq = [];
}

let testimonials = [];
try {
  const raw = fs.readFileSync(path.join(dataDir, 'testimonials.json'), 'utf-8');
  testimonials = JSON.parse(raw);
} catch (e) {
  testimonials = [];
}

let projects = [
  { id: '1', title: 'Milan Residence', type: 'Custom Recliner Villa', year: '2025' },
  { id: '2', title: 'Antwerp Penthouse', type: 'Motorized Sofa Lounge', year: '2024' },
  { id: '3', title: 'New York Gallery', type: 'Modular Motion Showcase', year: '2024' }
];

let media = [
  { id: '1', name: 'logo.png', url: '/shared/media/logo.png' }
];

let settings = {
  companyName: 'Climate Craft',
  tagline: 'Silent Motion Furniture Engineered in Belgium',
  contactEmail: 'hello@climatecraft.co'
};

let hotspots = [
  { id: '1', name: 'Dual-Motor Actuator', x: 30, y: 50, description: 'Silent whisper dual-motor actuation mechanism' },
  { id: '2', name: 'Hardwood Frame', x: 60, y: 40, description: '28-point kiln-dried hardwood frame' }
];

let currentUser = null;

// API Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const item = products.find(p => p.id === req.params.id);
  res.json(item || products[0] || {});
});

app.post('/api/products', (req, res) => {
  const newProd = { id: Date.now().toString(), ...req.body };
  products.push(newProd);
  res.json(newProd);
});

app.put('/api/products/:id', (req, res) => {
  const idx = products.findIndex(p => p.id === req.params.id);
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...req.body };
    return res.json(products[idx]);
  }
  res.json({ id: req.params.id, ...req.body });
});

app.delete('/api/products/:id', (req, res) => {
  products = products.filter(p => p.id !== req.params.id);
  res.json({ success: true });
});

app.get('/api/features', (req, res) => {
  res.json([
    { id: '1', title: 'Silent Actuation', description: 'Dual-motor smooth movement under 30dB' },
    { id: '2', title: 'Hardwood Frame', description: '28-point reinforced kiln-dried frame construction' },
    { id: '3', title: 'Archive Upholstery', description: 'Over 2000 curated fabrics and leathers' }
  ]);
});

app.put('/api/features/:id', (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/projects/:id', (req, res) => {
  const proj = projects.find(p => p.id === req.params.id);
  res.json(proj || projects[0] || {});
});

app.post('/api/projects', (req, res) => {
  const newProj = { id: Date.now().toString(), ...req.body };
  projects.push(newProj);
  res.json(newProj);
});

app.put('/api/projects/:id', (req, res) => {
  const idx = projects.findIndex(p => p.id === req.params.id);
  if (idx !== -1) {
    projects[idx] = { ...projects[idx], ...req.body };
    return res.json(projects[idx]);
  }
  res.json({ id: req.params.id, ...req.body });
});

app.delete('/api/projects/:id', (req, res) => {
  projects = projects.filter(p => p.id !== req.params.id);
  res.json({ success: true });
});

app.get('/api/media', (req, res) => {
  res.json(media);
});

app.post('/api/media/upload', (req, res) => {
  res.json({ id: Date.now().toString(), url: '/shared/media/logo.png', name: 'uploaded-file.png' });
});

app.delete('/api/media/:id', (req, res) => {
  media = media.filter(m => m.id !== req.params.id);
  res.json({ success: true });
});

app.get('/api/settings', (req, res) => {
  res.json(settings);
});

app.put('/api/settings', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

app.post('/api/auth/login', (req, res) => {
  currentUser = { id: 'admin-1', email: req.body.email || 'admin@climatecraft.co', role: 'admin' };
  res.json({ success: true, user: currentUser });
});

app.post('/api/auth/logout', (req, res) => {
  currentUser = null;
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  if (currentUser) {
    res.json(currentUser);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/api/hotspots', (req, res) => {
  res.json(hotspots);
});

app.put('/api/hotspots/:id', (req, res) => {
  const idx = hotspots.findIndex(h => h.id === req.params.id);
  if (idx !== -1) {
    hotspots[idx] = { ...hotspots[idx], ...req.body };
    return res.json(hotspots[idx]);
  }
  res.json({ id: req.params.id, ...req.body });
});

app.get('/api/faq', (req, res) => {
  res.json(faq);
});

app.get('/api/testimonials', (req, res) => {
  res.json(testimonials);
});

// Serve static assets & website
const clientWebPath = path.join(__dirname, 'client-website');
app.use(express.static(clientWebPath, { extensions: ['html'] }));

// Catch-all route to serve index.html for SPA / fallback
app.get('*', (req, res) => {
  const requestedFile = path.join(clientWebPath, req.path);
  if (fs.existsSync(requestedFile) && fs.statSync(requestedFile).isFile()) {
    return res.sendFile(requestedFile);
  }
  const htmlFile = requestedFile + '.html';
  if (fs.existsSync(htmlFile) && fs.statSync(htmlFile).isFile()) {
    return res.sendFile(htmlFile);
  }
  res.sendFile(path.join(clientWebPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Climate Craft server running on http://0.0.0.0:${PORT}`);
});

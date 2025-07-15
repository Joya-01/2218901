import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory stores
const urlStore = {};
const clickStats = {};

// Helper: Validate URL
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Helper: Generate random shortcode
function generateShortcode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper: Logging Middleware Integration
async function logEvent(source, level, route, message) {
  try {
    await fetch("http://20.244.56.144/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, level, route, message, timestamp: new Date().toISOString() })
    });
  } catch (err) {
    // Logging failed
  }
}

// POST /shorturls - Create a short URL
app.post('/shorturls', async (req, res) => {
  const { url, validity, shortcode } = req.body;
  const route = '/shorturls';

  // Validate URL
  if (!url || !isValidUrl(url)) {
    await logEvent('backend', 'ERROR', route, 'Invalid URL');
    return res.status(400).json({ error: 'Invalid URL format.' });
  }

  // Validate validity
  let validMinutes = 30;
  if (validity !== undefined) {
    if (!Number.isInteger(validity) || validity <= 0) {
      await logEvent('backend', 'ERROR', route, 'Invalid validity');
      return res.status(400).json({ error: 'Validity must be a positive integer (minutes).' });
    }
    validMinutes = validity;
  }

  // Validate/generate shortcode
  let code = shortcode;
  if (code) {
    if (!/^[a-zA-Z0-9]{4,}$/.test(code)) {
      await logEvent('backend', 'ERROR', route, 'Invalid shortcode');
      return res.status(400).json({ error: 'Shortcode must be alphanumeric and at least 4 characters.' });
    }
    if (urlStore[code]) {
      await logEvent('backend', 'ERROR', route, 'Shortcode already exists');
      return res.status(409).json({ error: 'Shortcode already exists.' });
    }
  } else {
    // Generate unique shortcode
    do {
      code = generateShortcode(6);
    } while (urlStore[code]);
  }

  // Calculate expiry
  const now = new Date();
  const expiry = new Date(now.getTime() + validMinutes * 60000);

  // Store URL
  urlStore[code] = {
    url,
    createdAt: now.toISOString(),
    expiry: expiry.toISOString(),
    validity: validMinutes
  };
  clickStats[code] = clickStats[code] || [];

  await logEvent('backend', 'INFO', route, `Short URL created for code: ${code}`);

  res.status(201).json({
    shortLink: `${req.protocol}://${req.get('host')}/${code}`,
    expiry: expiry.toISOString()
  });
});

// GET /:shortcode - Redirect to original URL
app.get('/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const route = '/:shortcode';
  const entry = urlStore[shortcode];

  if (!entry) {
    await logEvent('backend', 'ERROR', route, 'Shortcode not found');
    return res.status(404).json({ error: 'Shortcode not found.' });
  }

  const now = new Date();
  if (now > new Date(entry.expiry)) {
    await logEvent('backend', 'ERROR', route, 'Shortcode expired');
    return res.status(410).json({ error: 'Shortcode expired.' });
  }

  // Log click
  const click = {
    timestamp: now.toISOString(),
    referrer: req.get('referer') || '',
    geo: 'unknown' // Placeholder for geo, as IP/geo lookup is not implemented
  };
  clickStats[shortcode].push(click);
  await logEvent('backend', 'INFO', route, `Redirected for shortcode: ${shortcode}`);

  res.redirect(entry.url);
});

// GET /shorturls/:shortcode - Retrieve statistics for a short URL
app.get('/shorturls/:shortcode', async (req, res) => {
  const { shortcode } = req.params;
  const route = '/shorturls/:shortcode';
  const entry = urlStore[shortcode];

  if (!entry) {
    await logEvent('backend', 'ERROR', route, 'Shortcode not found');
    return res.status(404).json({ error: 'Shortcode not found.' });
  }

  const stats = clickStats[shortcode] || [];

  await logEvent('backend', 'INFO', route, `Stats retrieved for shortcode: ${shortcode}`);

  res.json({
    shortcode,
    originalUrl: entry.url,
    createdAt: entry.createdAt,
    expiry: entry.expiry,
    totalClicks: stats.length,
    clicks: stats
  });
});

// TODO: Implement endpoints here

app.listen(PORT, () => {
  console.log(`URL Shortener Microservice running on port ${PORT}`);
}); 
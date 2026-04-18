import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Security Headers (Protection against XSS, Clickjacking, etc.)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'"], // Required for some Vite features
      "img-src": ["'self'", "data:", "https://*"],
      "connect-src": ["'self'", "https://generativelanguage.googleapis.com", "https://*.firebaseio.com", "https://*.googleapis.com"]
    },
  },
}));

// 2. Rate Limiting (Protection against DoS and Brute Force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use('/api/', limiter); // Apply to API routes

// 3. Request Body Parsing
app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS

// 4. Static File Serving
app.use(express.static(path.join(__dirname, 'dist')));

// 5. Catch-all for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🛡️ Secure server is running on port ${PORT}`);
});

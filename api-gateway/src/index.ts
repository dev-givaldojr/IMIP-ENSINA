import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hospital_key';

// Internal URLs inside docker network
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3002';
const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL || 'http://patient-profile-service:3001';
const PROGRESS_SERVICE_URL = process.env.PROGRESS_SERVICE_URL || 'http://pedagogical-progress-service:3003';
const LUDIC_SERVICE_URL = process.env.LUDIC_SERVICE_URL || 'http://ludic-host-service:3004';

app.use(cors());


// Health check
app.get('/health', (req: express.Request, res: express.Response) => res.send('API Gateway is running'));

// Middleware to protect routes
const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ error: 'Nenhum token fornecido' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido ou expirado' });
    }
    // Adiciona as infos do usuário no request para serviços downstream
    req.headers['x-user-data'] = JSON.stringify(decoded);
    next();
  });
};

// ---------------------------------------------------------------------------
// ROUTES
// ---------------------------------------------------------------------------

// Public Routes (Auth)
app.use('/api/auth', createProxyMiddleware({ 
  target: AUTH_SERVICE_URL, 
  changeOrigin: true 
}));

// Protected Routes (Patient Profile)
app.use('/api/patients', verifyToken, createProxyMiddleware({ 
  target: PATIENT_SERVICE_URL, 
  changeOrigin: true 
}));

// Gamification
app.use('/api/gamification', verifyToken, createProxyMiddleware({ 
  target: LUDIC_SERVICE_URL, 
  changeOrigin: true 
}));

// Progress
app.use('/api/progress', verifyToken, createProxyMiddleware({ 
  target: PROGRESS_SERVICE_URL, 
  changeOrigin: true 
}));

// Internal notification endpoint (called by AI worker)
app.post('/internal/notify', express.json(), (req, res) => {
  const payload = req.body;
  // payload: { patientId, type: "MEDIA_GENERATED", data: { theme, story } }
  console.log('Broadcasting event via WebSocket:', payload);
  io.emit(`patient_events_${payload.patientId}`, payload);
  res.json({ success: true });
});

io.on('connection', (socket) => {
  console.log('A user connected via WebSocket', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hospital_key';
// Internal URLs inside docker network
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3002';
const PATIENT_SERVICE_URL = process.env.PATIENT_SERVICE_URL || 'http://patient-profile-service:3001';
app.use((0, cors_1.default)());
// Health check
app.get('/health', (req, res) => res.send('API Gateway is running'));
// Middleware to protect routes
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ error: 'Nenhum token fornecido' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
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
app.use('/api/auth', (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: AUTH_SERVICE_URL,
    changeOrigin: true
}));
// Protected Routes (Patient Profile)
app.use('/api/patients', verifyToken, (0, http_proxy_middleware_1.createProxyMiddleware)({
    target: PATIENT_SERVICE_URL,
    changeOrigin: true
}));
app.listen(PORT, () => {
    console.log(`API Gateway listening on port ${PORT}`);
});

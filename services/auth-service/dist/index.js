"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hospital_key';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/health', (req, res) => res.send('Auth Service is running'));
app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    // Em um cenário real, consultaríamos um banco de dados de professores.
    // Como o foco é a infraestrutura de JWT, usaremos um mock seguro.
    if (email && password) {
        const payload = {
            sub: 'teacher_123',
            name: 'Prof. Ana Silva',
            role: 'teacher'
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '8h' });
        return res.json({ token, user: payload });
    }
    return res.status(401).json({ error: 'Credenciais inválidas' });
});
// Rota auxiliar para validar token internamente pelo API Gateway
app.post('/api/auth/validate', (req, res) => {
    const { token } = req.body;
    if (!token)
        return res.status(401).json({ valid: false });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return res.json({ valid: true, user: decoded });
    }
    catch (err) {
        return res.status(401).json({ valid: false });
    }
});
app.listen(PORT, () => {
    console.log(`Auth Service listening on port ${PORT}`);
});

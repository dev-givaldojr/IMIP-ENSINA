import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3002;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_hospital_key';

app.use(cors());
app.use(express.json());

app.get('/health', (req: express.Request, res: express.Response) => res.send('Auth Service is running'));

app.post('/api/auth/login', (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;

  // Em um cenário real, consultaríamos um banco de dados de professores.
  // Como o foco é a infraestrutura de JWT, usaremos um mock seguro.
  if (email && password) {
    const payload = {
      sub: 'teacher_123',
      name: 'Prof. Ana Silva',
      role: 'teacher'
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });
    
    return res.json({ token, user: payload });
  }

  return res.status(401).json({ error: 'Credenciais inválidas' });
});

// Rota auxiliar para validar token internamente pelo API Gateway
app.post('/api/auth/validate', (req: express.Request, res: express.Response) => {
  const { token } = req.body;
  if (!token) return res.status(401).json({ valid: false });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return res.json({ valid: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ valid: false });
  }
});

app.listen(PORT, () => {
  console.log(`Auth Service listening on port ${PORT}`);
});

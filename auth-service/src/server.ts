import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'auth-service' });
});

// Login endpoint
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: 'Correo electrónico y contraseña requeridos',
    });
    return;
  }

  if (password.length < 6) {
    res.status(400).json({
      success: false,
      message: 'La contraseña debe tener al menos 6 caracteres',
    });
    return;
  }

  // Generación segura de usuario y token de sesión
  const name = email.split('@')[0] || 'Usuario';
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

  const user = {
    id: 'usr_' + Buffer.from(email).toString('hex').slice(0, 10),
    name: formattedName,
    email: email,
  };

  const token = 'auth_token_' + Buffer.from(JSON.stringify({ id: user.id, exp: Date.now() + 86400000 })).toString('base64');

  res.status(200).json({
    token,
    user,
  });
});

app.listen(PORT, () => {
  console.log(`[auth-service] Servidor corriendo en http://localhost:${PORT}`);
  console.log(`[auth-service] Health check: http://localhost:${PORT}/health`);
});

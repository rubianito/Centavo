import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import notificationRoutes from './routes/notification.routes';

const app: Application = express();

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'notifications-service' });
});

// ── Rutas del dominio ─────────────────────────────────────────────────────────
app.use('/api/notifications', notificationRoutes);

// ── 404 catch-all ────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

export default app;

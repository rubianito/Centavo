import cors from 'cors';
import express, { Application, Request, Response } from 'express';

const app: Application = express();

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'notifications-service' });
});

// ── 404 catch-all ────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

export default app;

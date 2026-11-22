import { Router } from 'express';
import {
  getById,
  list,
  markAsRead,
  processTransaction,
} from '../controllers/notification.controller';
import { validateTransactionEvent } from '../middlewares/validate.middleware';

const router = Router();

// POST /api/notifications/events/transaction — Procesa evento de transacción y evalúa sobregasto
router.post('/events/transaction', validateTransactionEvent, processTransaction);

// Alias conveniente para procesar eventos
router.post('/transaction-event', validateTransactionEvent, processTransaction);

// GET /api/notifications — Listar notificaciones y alertas (con ?read= y ?category= opcionales)
router.get('/', list);

// GET /api/notifications/:id — Consultar una notificación por ID
router.get('/:id', getById);

// PATCH /api/notifications/:id/read — Marcar notificación como leída
router.patch('/:id/read', markAsRead);

export default router;

import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import {
  getNotificationById,
  listNotifications,
  markNotificationAsRead,
  processTransactionEvent,
} from '../services/notification.service';

/**
 * POST /api/notifications/events/transaction
 * Procesa un evento de nueva transacción y genera alertas si se sobrepasa el presupuesto.
 */
export async function processTransaction(req: Request, res: Response): Promise<void> {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  try {
    const result = await processTransactionEvent(req.body);
    const statusCode = result.alertGenerated ? 201 : 200;
    res.status(statusCode).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error al procesar el evento de transacción',
      error: error?.message || 'Error desconocido',
    });
  }
}

/**
 * GET /api/notifications
 * Lista todas las alertas y notificaciones con filtros opcionales.
 */
export function list(req: Request, res: Response): void {
  const { read, category } = req.query;

  let readFilter: boolean | undefined = undefined;
  if (read !== undefined) {
    readFilter = read === 'true';
  }

  const notifications = listNotifications({
    read: readFilter,
    category: category ? String(category) : undefined,
  });

  res.status(200).json({ success: true, data: notifications });
}

/**
 * GET /api/notifications/:id
 * Consulta una notificación o alerta específica por su ID.
 */
export function getById(req: Request, res: Response): void {
  const { id } = req.params;
  const notification = getNotificationById(id);

  if (!notification) {
    res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    return;
  }

  res.status(200).json({ success: true, data: notification });
}

/**
 * PATCH /api/notifications/:id/read
 * Marca una notificación como leída.
 */
export function markAsRead(req: Request, res: Response): void {
  const { id } = req.params;
  const notification = markNotificationAsRead(id);

  if (!notification) {
    res.status(404).json({ success: false, message: 'Notificación no encontrada' });
    return;
  }

  res.status(200).json({ success: true, data: notification });
}

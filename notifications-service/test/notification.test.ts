import assert from 'node:assert/strict';
import http from 'node:http';
import { after, before, beforeEach, describe, it } from 'node:test';
import app from '../src/app';
import {
  clearNotifications,
  getNotificationById,
  listNotifications,
  markNotificationAsRead,
  processTransactionEvent,
} from '../src/services/notification.service';

describe('Notifications Service - Overspending Alerts', () => {
  beforeEach(() => {
    clearNotifications();
  });

  describe('Unit: processTransactionEvent', () => {
    it('should ignore income transactions and generate no alert', async () => {
      const result = await processTransactionEvent({
        amount: 5000,
        category: 'ingreso',
        budgetLimit: 1000,
      });

      assert.strictEqual(result.alertGenerated, false);
      assert.match(result.message, /ingreso/i);
      assert.strictEqual(listNotifications().length, 0);
    });

    it('should report when no budget is found for category', async () => {
      const result = await processTransactionEvent({
        amount: 200,
        category: 'categoria-inexistente',
      });

      assert.strictEqual(result.alertGenerated, false);
      assert.match(result.message, /No se encontró un presupuesto/i);
    });

    it('should not generate alert if spending is under 80%', async () => {
      const result = await processTransactionEvent({
        amount: 500,
        category: 'alimentación',
        budgetLimit: 1000,
      });

      assert.strictEqual(result.alertGenerated, false);
      assert.ok(result.budgetStatus);
      assert.strictEqual(result.budgetStatus.hasExceeded, false);
      assert.strictEqual(result.budgetStatus.percentageUsed, 50);
      assert.strictEqual(listNotifications().length, 0);
    });

    it('should generate WARNING_THRESHOLD alert when reaching 80%', async () => {
      const result = await processTransactionEvent({
        amount: 800,
        category: 'alimentación',
        budgetLimit: 1000,
      });

      assert.strictEqual(result.alertGenerated, true);
      assert.ok(result.alert);
      assert.strictEqual(result.alert.type, 'WARNING_THRESHOLD');
      assert.strictEqual(result.alert.severity, 'WARNING');
      assert.strictEqual(result.alert.percentageUsed, 80);
      assert.strictEqual(listNotifications().length, 1);
    });

    it('should generate OVERSPENT alert when exceeding budget (> 100%)', async () => {
      const result = await processTransactionEvent({
        transactionId: 'tx-test-101',
        amount: 1200,
        category: 'alimentación',
        budgetLimit: 1000,
      });

      assert.strictEqual(result.alertGenerated, true);
      assert.ok(result.alert);
      assert.strictEqual(result.alert.type, 'OVERSPENT');
      assert.strictEqual(result.alert.severity, 'CRITICAL');
      assert.strictEqual(result.alert.transactionId, 'tx-test-101');
      assert.strictEqual(result.alert.currentSpent, 1200);
      assert.strictEqual(result.alert.limitAmount, 1000);
      assert.strictEqual(result.alert.percentageUsed, 120);
      assert.strictEqual(result.alert.read, false);
      assert.match(result.alert.message, /Alerta de sobregasto/i);
      assert.strictEqual(listNotifications().length, 1);
    });

    it('should accumulate spending over multiple transactions in memory', async () => {
      const res1 = await processTransactionEvent({
        amount: 400,
        category: 'ocio',
        budgetLimit: 1000,
      });
      assert.strictEqual(res1.alertGenerated, false);

      const res2 = await processTransactionEvent({
        amount: 450,
        category: 'ocio',
        budgetLimit: 1000,
      });
      // 400 + 450 = 850 (85%) -> WARNING_THRESHOLD
      assert.strictEqual(res2.alertGenerated, true);
      assert.strictEqual(res2.alert?.type, 'WARNING_THRESHOLD');

      const res3 = await processTransactionEvent({
        amount: 200,
        category: 'ocio',
        budgetLimit: 1000,
      });
      // 850 + 200 = 1050 (105%) -> OVERSPENT
      assert.strictEqual(res3.alertGenerated, true);
      assert.strictEqual(res3.alert?.type, 'OVERSPENT');
      assert.strictEqual(res3.alert?.severity, 'CRITICAL');
      assert.strictEqual(res3.budgetStatus?.newSpent, 1050);
    });

    it('should respect negative amount as expense value and explicit currentSpent', async () => {
      const result = await processTransactionEvent({
        amount: -300,
        category: 'transporte',
        currentSpent: 800,
        budgetLimit: 1000,
      });

      assert.strictEqual(result.alertGenerated, true);
      assert.strictEqual(result.alert?.type, 'OVERSPENT');
      assert.strictEqual(result.budgetStatus?.previousSpent, 800);
      assert.strictEqual(result.budgetStatus?.newSpent, 1100);
    });
  });

  describe('Unit: notification storage & management', () => {
    it('should list, filter, get by id, and mark as read', async () => {
      await processTransactionEvent({
        amount: 1500,
        category: 'ropa',
        budgetLimit: 1000,
      });
      await processTransactionEvent({
        amount: 850,
        category: 'salud',
        budgetLimit: 1000,
      });

      const all = listNotifications();
      assert.strictEqual(all.length, 2);

      const ropaList = listNotifications({ category: 'ropa' });
      assert.strictEqual(ropaList.length, 1);
      assert.strictEqual(ropaList[0].category, 'ropa');

      const targetId = all[0].id;
      const found = getNotificationById(targetId);
      assert.ok(found);
      assert.strictEqual(found.read, false);

      const updated = markNotificationAsRead(targetId);
      assert.ok(updated);
      assert.strictEqual(updated.read, true);

      const unread = listNotifications({ read: false });
      assert.strictEqual(unread.length, 1);
      const read = listNotifications({ read: true });
      assert.strictEqual(read.length, 1);
    });
  });

  describe('Integration: HTTP Endpoints', () => {
    let server: http.Server;
    let baseUrl: string;

    before((_, done) => {
      server = app.listen(0, () => {
        const addr = server.address() as { port: number };
        baseUrl = `http://localhost:${addr.port}`;
        done();
      });
    });

    after((_, done) => {
      server.close(done);
    });

    it('GET /health should return 200 ok', async () => {
      const res = await fetch(`${baseUrl}/health`);
      assert.strictEqual(res.status, 200);
      const json = (await res.json()) as any;
      assert.strictEqual(json.status, 'ok');
      assert.strictEqual(json.service, 'notifications-service');
    });

    it('POST /api/notifications/events/transaction returns 201 on overspend alert', async () => {
      const payload = {
        transactionId: 'tx-http-1',
        amount: 1500,
        category: 'alimentación',
        budgetLimit: 1000,
      };

      const res = await fetch(`${baseUrl}/api/notifications/events/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      assert.strictEqual(res.status, 201);
      const json = (await res.json()) as any;
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.alertGenerated, true);
      assert.strictEqual(json.data.alert.type, 'OVERSPENT');
      assert.strictEqual(json.data.alert.severity, 'CRITICAL');
      assert.strictEqual(json.data.budgetStatus.hasExceeded, true);
    });

    it('POST /api/notifications/transaction-event (alias) works for events within budget', async () => {
      const payload = {
        amount: 300,
        category: 'educación',
        budgetLimit: 1000,
      };

      const res = await fetch(`${baseUrl}/api/notifications/transaction-event`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      assert.strictEqual(res.status, 200);
      const json = (await res.json()) as any;
      assert.strictEqual(json.success, true);
      assert.strictEqual(json.data.alertGenerated, false);
      assert.strictEqual(json.data.budgetStatus.hasExceeded, false);
    });

    it('POST /api/notifications/events/transaction rejects invalid body with 400', async () => {
      const res = await fetch(`${baseUrl}/api/notifications/events/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 0 }), // Missing category, amount is 0
      });

      assert.strictEqual(res.status, 400);
      const json = (await res.json()) as any;
      assert.strictEqual(json.success, false);
      assert.ok(Array.isArray(json.errors));
      assert.ok(json.errors.length >= 2);
    });

    it('GET /api/notifications and PATCH /api/notifications/:id/read flow', async () => {
      // Create an alert
      const postRes = await fetch(`${baseUrl}/api/notifications/events/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 2000,
          category: 'viajes',
          budgetLimit: 1000,
        }),
      });
      const postJson = (await postRes.json()) as any;
      const alertId = postJson.data.alert.id;

      // GET by id
      const getRes = await fetch(`${baseUrl}/api/notifications/${alertId}`);
      assert.strictEqual(getRes.status, 200);
      const getJson = (await getRes.json()) as any;
      assert.strictEqual(getJson.data.id, alertId);
      assert.strictEqual(getJson.data.read, false);

      // PATCH read
      const patchRes = await fetch(`${baseUrl}/api/notifications/${alertId}/read`, {
        method: 'PATCH',
      });
      assert.strictEqual(patchRes.status, 200);
      const patchJson = (await patchRes.json()) as any;
      assert.strictEqual(patchJson.data.read, true);
    });
  });
});

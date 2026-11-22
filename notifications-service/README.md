# 🔔 notifications-service

Microservicio de alertas y notificaciones de sobregasto del proyecto **Centavo**.

---

## 🎯 Responsabilidades

- Recibir eventos de nuevas transacciones financieras.
- Conciliar el gasto acumulado contra el presupuesto configurado en `budgets-service` (o provisto en el evento).
- Evaluar umbrales de gasto:
  - **Advertencia preventiva:** Cuando el gasto alcanza o supera el 80% del límite presupuestario.
  - **Alerta de sobregasto crítica:** Cuando el gasto supera el 100% del límite presupuestario.
- Generar y registrar alertas in-app para consulta del usuario.
- (Próximas iteraciones) Despachar notificaciones a través de canales externos (correo electrónico, notificaciones push, SMS).
- (Próximas iteraciones) Suscripción directa a un message broker (RabbitMQ / Kafka / Redis Streams).

---

## 🚀 Cómo correrlo

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

Por defecto, el servicio corre en el puerto `4003` y consulta `budgets-service` en `http://localhost:4002`.

### 3. Modo desarrollo (hot-reload)

```bash
npm run dev
```

### 4. Build para producción

```bash
npm run build
npm start
```

---

## 📡 Endpoints

### `POST /api/notifications/events/transaction`

Recibe un evento de transacción nueva y evalúa si se debe generar una alerta de sobregasto o advertencia de presupuesto.

> **Alias disponible:** `POST /api/notifications/transaction-event`

**Body (JSON):**

```json
{
  "transactionId": "tx-12345",
  "amount": 1200,
  "category": "alimentación",
  "date": "2026-09-29",
  "description": "Supermercado mensual"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `amount` | `number` | ✅ | Monto de la transacción (positivo o negativo) |
| `category` | `string` | ✅ | Categoría de la transacción (ej. `alimentación`, `ocio`, `vivienda`, etc.) |
| `transactionId` | `string` | ❌ | ID de la transacción originada en `transaction-service` |
| `currentSpent` | `number` | ❌ | Gasto acumulado previo (si no se envía, se calcula con el estado en memoria) |
| `budgetLimit` | `number` | ❌ | Monto límite del presupuesto (si no se envía, se consulta a `budgets-service`) |

**Respuesta cuando se genera sobregasto (`201 Created`):**

```json
{
  "success": true,
  "data": {
    "alertGenerated": true,
    "message": "Alerta de sobregasto generada exitosamente.",
    "alert": {
      "id": "e462bb02-bc32-4d1e-84d3-0599a0fcbeee",
      "transactionId": "tx-12345",
      "category": "alimentación",
      "type": "OVERSPENT",
      "severity": "CRITICAL",
      "message": "¡Alerta de sobregasto! Has superado el presupuesto de \"alimentación\" en $200.00. Gasto acumulado: $5200.00 de un límite de $5000.00 (104%).",
      "transactionAmount": 1200,
      "currentSpent": 5200,
      "limitAmount": 5000,
      "percentageUsed": 104,
      "channel": "IN_APP",
      "read": false,
      "createdAt": "2026-09-29T18:00:00.000Z"
    },
    "budgetStatus": {
      "category": "alimentación",
      "limitAmount": 5000,
      "previousSpent": 4000,
      "newSpent": 5200,
      "percentageUsed": 104,
      "hasExceeded": true
    }
  }
}
```

**Respuesta cuando el gasto está dentro del presupuesto (`200 OK`):**

```json
{
  "success": true,
  "data": {
    "alertGenerated": false,
    "message": "Transacción procesada dentro de los límites del presupuesto.",
    "budgetStatus": {
      "category": "alimentación",
      "limitAmount": 5000,
      "previousSpent": 1000,
      "newSpent": 2200,
      "percentageUsed": 44,
      "hasExceeded": false
    }
  }
}
```

**Error de validación (`400 Bad Request`):**

```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "msg": "amount es requerido",
      "path": "amount",
      "location": "body"
    }
  ]
}
```

---

### `GET /api/notifications`

Lista las alertas y notificaciones generadas. Permite filtrar opcionalmente por query params.

**Query Params (opcionales):**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `read` | `boolean` | Filtra por estado de lectura (`?read=true` o `?read=false`) |
| `category` | `string` | Filtra por categoría (ej. `?category=alimentación`) |

**Respuesta exitosa (`200 OK`):**

```json
{
  "success": true,
  "data": [
    {
      "id": "e462bb02-bc32-4d1e-84d3-0599a0fcbeee",
      "transactionId": "tx-12345",
      "category": "alimentación",
      "type": "OVERSPENT",
      "severity": "CRITICAL",
      "message": "¡Alerta de sobregasto! Has superado el presupuesto de \"alimentación\" en $200.00.",
      "transactionAmount": 1200,
      "currentSpent": 5200,
      "limitAmount": 5000,
      "percentageUsed": 104,
      "channel": "IN_APP",
      "read": false,
      "createdAt": "2026-09-29T18:00:00.000Z"
    }
  ]
}
```

---

### `GET /api/notifications/:id`

Consulta una alerta o notificación específica por ID.

---

### `PATCH /api/notifications/:id/read`

Marca una alerta como leída.

---

### `GET /health`

Health check del servicio.

**Respuesta exitosa (`200 OK`):**

```json
{
  "status": "ok",
  "service": "notifications-service"
}
```

---

## 📂 Estructura del Código

```text
notifications-service/
├── src/
│   ├── controllers/
│   │   └── notification.controller.ts    # Manejo de peticiones y respuestas HTTP
│   ├── middlewares/
│   │   └── validate.middleware.ts        # Validaciones de eventos de transacción
│   ├── models/
│   │   └── notification.model.ts         # Modelos e interfaces de dominio y alertas
│   ├── routes/
│   │   └── notification.routes.ts        # Definición de rutas del microservicio
│   ├── services/
│   │   └── notification.service.ts       # Lógica de conciliación y generación de alertas
│   ├── app.ts                            # Configuración de Express y middlewares
│   └── server.ts                         # Punto de entrada y listener del servidor
├── .env                                  # Variables de entorno locales
├── .env.example                          # Plantilla de variables de entorno
├── AGENTS.md                             # Pautas operativas para agentes AI
├── package.json                          # Scripts y dependencias
├── README.md                             # Documentación del microservicio
└── tsconfig.json                         # Configuración del compilador TypeScript
```

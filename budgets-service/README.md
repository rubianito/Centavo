# 📊 budgets-service

Microservicio de definición, control y seguimiento de presupuestos del proyecto **Centavo**.

---

## 🎯 Responsabilidades

- Crear y almacenar presupuestos clasificados por categoría, monto límite y periodo.
- Exponer presupuestos para consulta, filtrado por categoría y periodo.
- (Próximas iteraciones) Conciliar gastos registrados por `transaction-service` y calcular el porcentaje de ejecución presupuestaria.
- (Próximas iteraciones) Emitir eventos de sobrecosto y alertas hacia `notifications-service`.

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

Por defecto, el servicio corre en el puerto `4002`.

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

### `POST /api/budgets`

Crea un nuevo presupuesto.

**Body (JSON):**

```json
{
  "category": "alimentación",
  "limitAmount": 5000,
  "period": "mensual"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `category` | `string` | ✅ | Categoría del gasto (ej. `alimentación`, `vivienda`, `transporte`, `ocio`, etc.) |
| `limitAmount` | `number` | ✅ | Monto límite presupuestado (debe ser mayor a 0). Se admite también como `limit` o `montoLimite` |
| `period` | `string` | ✅ | Periodicidad: `semanal`, `mensual` o `anual` |

**Respuesta exitosa (`201`):**

```json
{
  "success": true,
  "data": {
    "id": "a5d09f7a-2457-41fe-8b1e-b3f7f1a3028c",
    "category": "alimentación",
    "limitAmount": 5000,
    "period": "mensual",
    "createdAt": "2026-09-29T15:00:00.000Z",
    "updatedAt": "2026-09-29T15:00:00.000Z"
  }
}
```

**Error de validación (`400`):**

```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "value": -10,
      "msg": "limitAmount debe ser un número positivo mayor a 0",
      "path": "limitAmount",
      "location": "body"
    }
  ]
}
```

---

### `GET /api/budgets`

Retorna la lista de presupuestos registrados. Permite filtrar opcionalmente por query params.

**Query Params (opcionales):**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `category` | `string` | Filtra presupuestos por categoría (ej. `?category=alimentación`) |
| `period` | `string` | Filtra presupuestos por periodicidad (ej. `?period=mensual`) |

**Ejemplo de solicitud:**

```bash
GET /api/budgets?category=alimentación&period=mensual
```

**Respuesta exitosa (`200`):**

```json
{
  "success": true,
  "data": [
    {
      "id": "a5d09f7a-2457-41fe-8b1e-b3f7f1a3028c",
      "category": "alimentación",
      "limitAmount": 5000,
      "period": "mensual",
      "createdAt": "2026-09-29T15:00:00.000Z",
      "updatedAt": "2026-09-29T15:00:00.000Z"
    }
  ]
}
```

---

### `GET /api/budgets/:id`

Consulta el detalle de un presupuesto por su identificador único.

**Respuesta exitosa (`200`):**

```json
{
  "success": true,
  "data": {
    "id": "a5d09f7a-2457-41fe-8b1e-b3f7f1a3028c",
    "category": "alimentación",
    "limitAmount": 5000,
    "period": "mensual",
    "createdAt": "2026-09-29T15:00:00.000Z",
    "updatedAt": "2026-09-29T15:00:00.000Z"
  }
}
```

**No encontrado (`404`):**

```json
{
  "success": false,
  "message": "Presupuesto no encontrado"
}
```

---

### `GET /health`

Health check del servicio.

**Respuesta exitosa (`200`):**

```json
{
  "status": "ok",
  "service": "budgets-service"
}
```

---

## 📂 Estructura del Código

```text
budgets-service/
├── src/
│   ├── controllers/
│   │   └── budget.controller.ts    # Manejo de peticiones y respuestas HTTP
│   ├── middlewares/
│   │   └── validate.middleware.ts  # Validaciones con express-validator
│   ├── models/
│   │   └── budget.model.ts         # Tipos e interfaces de dominio
│   ├── routes/
│   │   └── budget.routes.ts        # Definición de rutas del microservicio
│   ├── services/
│   │   └── budget.service.ts       # Lógica de negocio y persistencia en memoria
│   ├── app.ts                      # Configuración de Express y middlewares
│   └── server.ts                   # Punto de entrada y listener del servidor
├── .env.example                    # Ejemplo de variables de entorno
├── AGENTS.md                       # Pautas operativas para agentes AI
├── package.json                    # Scripts y dependencias
├── README.md                       # Documentación del microservicio
└── tsconfig.json                   # Configuración del compilador TypeScript
```

# 💳 transaction-service

Microservicio de registro y categorización de transacciones financieras del proyecto **Centavo**.

---

## 🎯 Responsabilidades

- Crear y almacenar transacciones (ingresos y gastos).
- Clasificar transacciones por categorías predefinidas.
- Exponer transacciones para consulta y filtrado.
- (Próxima iteración) Publicar eventos de nuevos gastos hacia `budgets-service`.

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

### 3. Modo desarrollo (hot-reload)

```bash
npm run dev
```

### 4. Build para producción

```bash
npm run build
npm start
```

El servicio corre por defecto en `http://localhost:3001`.

---

## 📡 Endpoints

### `POST /api/transactions`

Crea una nueva transacción.

**Body (JSON):**

```json
{
  "amount": -250.50,
  "category": "alimentación",
  "date": "2026-09-28",
  "description": "Supermercado La Colonia"
}
```

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `amount` | `number` | ✅ | Monto. Negativo = gasto, positivo = ingreso. Rango: ±1,000,000 |
| `category` | `string` | ✅ | Ver categorías válidas abajo |
| `date` | `string` | ✅ | Fecha en formato `YYYY-MM-DD` |
| `description` | `string` | ❌ | Descripción libre (máx. 255 caracteres) |

**Respuesta exitosa (`201`):**

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "amount": -250.50,
    "category": "alimentación",
    "date": "2026-09-28",
    "description": "Supermercado La Colonia",
    "createdAt": "2026-09-28T22:03:00.000Z"
  }
}
```

**Error de validación (`400`):**

```json
{
  "success": false,
  "errors": [
    { "field": "amount", "message": "amount es requerido" }
  ]
}
```

---

### `GET /api/transactions`

Lista todas las transacciones, ordenadas de más reciente a más antigua.

**Query params opcionales:**

| Param | Tipo | Descripción |
|-------|------|-------------|
| `category` | `string` | Filtra por categoría |

**Ejemplo:**

```
GET /api/transactions?category=alimentación
```

**Respuesta (`200`):**

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "amount": -250.50,
      "category": "alimentación",
      "date": "2026-09-28",
      "description": "Supermercado La Colonia",
      "createdAt": "2026-09-28T22:03:00.000Z"
    }
  ]
}
```

---

### `GET /health`

Health check del servicio.

```json
{ "status": "ok", "service": "transaction-service" }
```

---

## 🏷️ Categorías válidas

| Categoría | Uso típico |
|-----------|-----------|
| `alimentación` | Supermercados, restaurantes, delivery |
| `vivienda` | Renta, mantenimiento, hipoteca |
| `transporte` | Gasolina, taxi, transporte público |
| `salud` | Médicos, farmacia, seguros médicos |
| `educación` | Cursos, libros, universidad |
| `ocio` | Entretenimiento, viajes, hobbies |
| `servicios` | Luz, agua, internet, teléfono |
| `ropa` | Ropa y calzado |
| `ahorro` | Transferencias a ahorro o inversión |
| `ingreso` | Salario, freelance, ingresos varios |
| `otro` | Cualquier categoría no contemplada |

---

## 🗂️ Estructura del servicio

```
src/
├── app.ts                       # Express app: middlewares y rutas
├── server.ts                    # Entry point HTTP
├── controllers/
│   └── transaction.controller.ts
├── services/
│   └── transaction.service.ts   # Lógica de negocio (store en memoria)
├── models/
│   └── transaction.model.ts     # Tipos TypeScript
├── middlewares/
│   └── validate.middleware.ts   # Validación con express-validator
└── routes/
    └── transaction.routes.ts
```

---

## 🔮 Próximos pasos

- [ ] Conectar a PostgreSQL — agregar capa de repositorio en `src/repositories/`.
- [ ] Endpoint `DELETE /api/transactions/:id`.
- [ ] Endpoint `PATCH /api/transactions/:id`.
- [ ] Publicar evento `transaction.created` a `budgets-service` vía mensajería (RabbitMQ / Redis).
- [ ] Paginación en `GET /api/transactions`.
- [ ] Filtro por rango de fechas (`?from=&to=`).
- [ ] Autenticación JWT middleware (integración con `auth-service`).
- [ ] Tests unitarios con Jest.

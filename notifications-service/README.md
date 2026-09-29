# 🔔 notifications-service

Microservicio de alertas y notificaciones de sobregasto del proyecto **Centavo**.

---

## 🎯 Responsabilidades

- Recibir eventos de nuevas transacciones financieras.
- Conciliar el gasto acumulado contra el presupuesto configurado en `budgets-service`.
- Evaluar umbrales de gasto:
  - **Advertencia preventiva:** Cuando el gasto alcanza o supera el 80% del límite presupuestario.
  - **Alerta de sobregasto crítica:** Cuando el gasto supera el 100% del límite presupuestario.
- Generar y registrar alertas in-app para consulta del usuario.

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

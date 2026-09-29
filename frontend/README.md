# Centavo Frontend

## Stack

| Capa | Tecnología |
|---|---|
| Framework | **React 18** + **Vite 6** |
| Lenguaje | **TypeScript 5** |
| Estilos | **Tailwind CSS 3** (utility-first, paleta `brand` en `tailwind.config.js`) |
| Iconos | **lucide-react** |
| Estado | React hooks (`useState`, `useEffect`, `useCallback`) — sin store externo por ahora |
| HTTP / API | `src/services/apiClient.ts` — todos los `fetch` pasan por aquí |
| Autenticación | `src/hooks/useAuth.ts` — única fuente de verdad para sesión y token |

## Convenciones (ver también `AGENTS.md`)

- Componentes: **PascalCase** (`LoginForm.tsx`, `TransactionList.tsx`)
- Hooks: prefijo **`use`** (`useAuth.ts`)
- Páginas: carpeta `src/pages/`, sufijo **`Page`** (`LoginPage.tsx`, `DashboardPage.tsx`)
- Toda llamada a la API: a través de `src/services/`; **nunca `fetch` suelto en un componente**
- Estado: en hooks o contexto; **nunca inline en JSX**
- Sin componentes de clase

## Variables de entorno

Copia `.env.example` a `.env.local` para desarrollo:

```bash
cp .env.example .env.local
```

| Variable | Descripción |
|---|---|
| `VITE_AUTH_API_URL` | URL base del `auth-service` (ej. `http://localhost:4001/api/auth/login`) |
| `VITE_TRANSACTIONS_API_URL` | URL base del `transaction-service` (ej. `http://localhost:4002/api/transactions`) |

## Desarrollo local

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # Build de producción
npm run lint     # ESLint
```

## Estructura

```
src/
├── components/        # Componentes reutilizables (PascalCase)
├── hooks/             # Hooks personalizados (prefijo use)
├── pages/             # Páginas/vistas (sufijo Page)
├── services/          # Capa de llamadas a la API
│   ├── apiClient.ts   # Cliente HTTP base con manejo de tokens
│   ├── authService.ts # Operaciones de autenticación
│   └── transactionService.ts
├── types/             # Interfaces y tipos TypeScript del dominio
├── App.tsx            # Router y rutas protegidas
├── main.tsx           # Punto de entrada
└── index.css          # Estilos globales (Tailwind directives)
```

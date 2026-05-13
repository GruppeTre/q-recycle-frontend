# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Authentication

Auth state lives in `AuthContext` (wraps the whole app in `App.jsx`). To access it anywhere:

```js
import { useAuth } from './context/useAuth';

const { session, role, isLoading } = useAuth();
```

- `session` — Supabase session, `null` if logged out
- `role` — `'admin'`, `'driver'`, or `'partner'`, `null` if logged out
- `isLoading` — check this first before doing anything with `session` or `role`

### Route guards

**`<ProtectedRoute>`** — bounces you away if you're not logged in or don't have the right role.

```jsx
<ProtectedRoute redirectPath="/partner" allowedRoles={[role.PARTNER]}>
  <Dashboard />
</ProtectedRoute>
```

**`<GuestRoute>`** — redirects you to your dashboard if you're already logged in. Wrap login pages with this. `allowedRoles` lets specific roles through if needed.

```jsx
// nobody logged in should see this
<GuestRoute>
  <UserLoginPage />
</GuestRoute>

// except admins and drivers can still access this one
<GuestRoute allowedRoles={[role.ADMIN, role.DRIVER]}>
  <PartnerLoginPage />
</GuestRoute>
```

Roles are defined in `src/config/constants.js`.

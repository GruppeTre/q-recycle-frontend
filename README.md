## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Authentication

A global authentication and authorization state lives in `AuthContext` (wraps the whole app in `App.jsx`). Use the auth hook to access it anywhere:

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

# Reusable layout components

## PageContainer
The ``PageContainer`` component is a very simple responsive page wapper, that provides a centered container with a set margin and padding. It is recommended to use this
wrapper as the top-level component on most user-facing views/pages, to ensure consistent baseline responsiveness across the app:

If a certain element (e.g. the [navbar](#navbar)) should span the full width of the page,
it can be put outside of the ``PageContainer`` component:

```javascript
<div>
    <Navbar title="Admin" navItems={adminNavItems}/>
    <PageContainer>
        {/* Page content here */}
    </PageContainer>
</div>
```
## Navbar
The ``Navbar`` component is a responsive header & navbar, designed to be as simple to use as possible.
It is intended to span the full width of the page. The navigational links responsively collapse into an accordion
on smaller screens, and automatically highlight the link indicating the current page.

The ``Navbar`` component takes two props:

```javascript
<div className="h-dvh">
    <Navbar title="Admin" navItems={adminNavItems}/>
    {/* Page content here */}
</div>
```

- `title` — Title presented next to the logo in navbar
- `navItems` — array of ``navItem`` objects

The ``navItem`` object has three _required_ fields:

```javascript
{
    icon: <Truck />,
    label: "Drivers",
    to: "/admin/drivers"
}
```

- `icon` — any Lucide icon component
- `label` — text presented on the navigational button
- `to` — path that the link should navigate to

the ``navItem`` array can be defined in a separate module local to the corresponding page component 
(e.g ``adminNavItems.jsx`` in ``src/features/admin-dashboard``)

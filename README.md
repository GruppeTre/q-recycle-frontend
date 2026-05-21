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

## Reusable layout components

### PageContainer
The ``PageContainer`` component is a very simple responsive page wapper, that provides a centered container with a set margin and padding. It is recommended to use this
wrapper as the top-level component on most user-facing views/pages, to ensure consistent baseline responsiveness across the app:

If a certain element (e.g. the [navbar](#navbar)) should span the full width of the page,
it can be put outside of the ``PageContainer`` component:

```javascript
import PageContainer from "./PageContainer";

<div>
    <Navbar title="Admin" navItems={adminNavItems}/>
    <PageContainer>
        {/* Page content here */}
    </PageContainer>
</div>
```

### SectionCard & SectionCardExpandable
The ``SectionCard`` and ``SectionCardExpandable`` components are simple card components, which can be used
to section off related content:

```javascript
import SectionCard from "./SectionCard";
import SectionCardExpandable from "./SectionCardExpandable";

<PageContainer>
    <SectionCard title="First Section" backgroundColor="blue-200">
        {/* Section content here */}
    </SectionCard>

    <SectionCardExpandable title="Expandable section" onChange={(state) => foo(state)}>
        {/* Expandable content here */}
    </SectionCardExpandable>
</PageContainer>
```
- `title` (optional) — Title presented in the top of the card
- `backgroundColor` — determine the background color of the card: ``--color-background``

Optionally, the ``SectionCard`` component takes a ``headerContent`` prop, which can be used
to insert a JSX expression into the header of the card:

```javascript
import SectionCard from "./SectionCard";

<PageContainer>
    <SectionCard headerContent={
        <div className="flex justify-between">
            <h2>This is a section header</h2>
            <button>some action</button>
        </div>
    }>
        {/* Section content here */}
    </SectionCard>
</PageContainer>
```

The ``SectionCardExpandable`` can optionally take an ``onToggle`` callback function, that will be called with the  state (bool ``isOpen``) every time the component is opened/closed.

### Spinner
The ``Spinner`` component is a simple loading spinner, that can be used to indicate content not yet ready to display:

```javascript
import Spinner from "./Spinner";

<div>
    {isLoading
        ? <Spinner size={16} thickness={8} color={'blue 500'}/>
        : <div>
            {/* loaded content here */}
        </div>
    }
</div>
```

- `size` - size of the spinner in pixels, default: ``12``
- `thickness` - thickness of the spinner, default: ``6``
- ``color`` - color of the spinner, defaults: ``--color-primary``

### Navbar
The ``Navbar`` component is a responsive header & navbar, designed to be as simple to use as possible.
It is intended to span the full width of the page. The navigational links responsively collapse into an accordion
on smaller screens, and automatically highlight the link indicating the current page.

The ``Navbar`` component takes two props:

```javascript
import Navbar from "./Navbar";

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

## Styling

### Typography
A few basic tailwind variables for standard text variations are defined in ``main.css``:

 - ``text-hero-header`` — large and bold header, should be used very sparingly
 - ``text-section-header`` — smaller header, can be used to title sections or groups of content
 - ``text-body`` — standard body text
 - ``text-muted`` — same size as body text, but in a more muted color. Can be used for asides or to imply a lower hierarchical value of some text
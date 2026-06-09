# CLAUDE.md — Fulusme Web (Architecture Audit & Refactoring Charter)

> Audit performed against the `dev-cleanup` branch. This document is both an
> honest assessment of the codebase _as it exists today_ and the binding set of
> rules for the upcoming refactor. Where a decision was required, it has been
> made — see the **Decisions Log** (§10). "It depends" is not an acceptable
> answer in this document.

> **STATUS (2026-06-09).** Phases 0–3 + the `src/` feature-based move (Phases
> A–F of `MIGRATION.md`) and Phase E (route groups + provider shell) are
> **done**. The §2 assessment below is the original audit; each item is now
> tagged **[RESOLVED] / [PARTIAL] / [OPEN]**. Still open: `reactStrictMode`
> flip, `any` burn-down (~121), service-less `Swal` in components (~100, allowed
> per D7), 4 raw `<img>`, the 34 `@/utils/axios` shim importers (axios-cleanup
> follow-up), the lingering `next-auth` dependency, and the `role-sync` trust
> issue (§5/§9). `MIGRATION.md` tracks the remaining structural cleanup.

---

## 1. PROJECT OVERVIEW

| Concern        | Current                                                                                                                               | Target                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Framework      | Next.js **16.1.6** (App Router)                                                                                                       | Next.js 16.x (App Router)                                                 |
| React          | **19.1.0** ✅ (upgraded)                                                                                                                   | **19.x** (required by Next 16)                                            |
| Bundler        | Turbopack (Next 16 default)                                                                                                           | Turbopack — keep, no custom webpack                                       |
| Language       | TypeScript 5, `strict: true`                                                                                                          | unchanged                                                                 |
| Styling        | Tailwind CSS 3.4 + local Geist fonts                                                                                                  | Tailwind 3.x (4.x optional, separate effort)                              |
| State mgmt     | Redux Toolkit 2.x in `src/store` (UI/client state); dead slices removed ✅                                                                          | RTK for genuine client/UI state only                                      |
| Data fetching  | Single `shared/lib/api-client` ✅ + typed `features/*/services` ✅; Server-Component-first **[PARTIAL]** (many client fetches remain); 34 `@/utils/axios` shim importers **[OPEN]**                                              | Server Components + single `api-client`; React Query only where justified |
| Auth (current) | `httpOnly` `auth_token`/`auth_role` + client-readable `session` cookie ✅; `src/proxy.ts` reads httpOnly ✅; NextAuth route deleted (dep lingers) **[OPEN]**    | `httpOnly` cookies + `proxy.ts` Thin Proxy                                |
| Backend        | Multiple external REST hosts (`api-staging-capbridge`, `api-sabi`, `api.gateway`, `api.wilayah.site`) — **no single source of truth** | One `NEXT_PUBLIC_API_BACKEND` base + typed service layer                  |
| Routing        | `src/app/` with `(marketing)`/`(auth)`/`(dashboard)`/`(standalone)` route groups; one dashboard tree; chrome via group layouts ✅          | Consolidated under route groups                                           |

**Headline:** the project was upgraded to Next.js 16 by bumping `next` in
`package.json`, but **React was left at 18.3.1**. Next.js 16 requires React 19.
This is a build/runtime incompatibility and is treated as the #1 blocker below.

---

## 2. CURRENT STATE ASSESSMENT

> **Resolution status (2026-06-09).** [RESOLVED] 1, 2, 4, 5, 6, 10, 12, 13 · [PARTIAL] 3, 7, 8, 9 · [OPEN] 11, 14, 15, 16. Partials: (3) `proxy.ts` reads httpOnly but `role-sync` still trusts a client-supplied role (§5/§9); (7) `api-client` unified yet `contentService` still hardcodes a host; (8) `utils`/`helper`/`interfaces` collapsed into `shared` + per-feature, but root `utils/` axios shims linger (34 importers); (9) services exist yet several views (ProfileView, forms) still fetch via raw axios and per-route dedup is incomplete. Open items are the §STATUS-banner follow-ups.

### 🔴 Critical (security / data integrity / breaks on Next 16)

1. **React 18.3.1 under Next.js 16.** `package.json:34,37,41` (`next ^16.1.6`,
   `react 18.3.1`, `react-dom 18.3.1`) and `@types/react ^18`
   (`package.json:72`). Next 16 requires React 19. Must upgrade React before any
   other work; everything else builds on this.
2. **Auth tokens live in JavaScript-readable cookies.** `app/lib/auth.ts`
   stores the entire auth object (`token`, `refresh`, `role`, flags) as a
   plaintext JSON cookie via `js-cookie` (`Cookies.set("user", …)`).
   `app/lib/utils.ts:18` exposes `getToken()` from a `token` cookie.
   `app/helper/cookie.ts` is a second generic cookie helper. Any XSS reads the
   access **and** refresh token. This is the central security defect.
3. **`proxy.ts` trusts a client-writable cookie for authorization.**
   `proxy.ts:6,27` reads `user` and `JSON.parse`s `role` to gate
   `/create-project` and `/dokumen-pelengkap`. Because the cookie is not
   `httpOnly` and not signed, a user can forge `role: "emiten"` in devtools and
   pass the edge check. Authorization is effectively client-side.
4. **Secrets/config files committed to git.** `.env`, `.env.development`,
   `.env.production` are all tracked (`git ls-files` confirms), despite
   `.gitignore` listing two of them. Today every key is `NEXT_PUBLIC_*` so the
   _values_ are non-secret, but the moment a real secret (e.g.
   `NEXTAUTH_SECRET`, referenced at `app/api/auth/[...nextauth]/route.ts:65`) is
   added it will leak. `NEXTAUTH_SECRET` is referenced but **not present** in any
   env file — NextAuth is running without a configured secret.
5. **Whole-app hydration flicker.** `app/components/client/Client.tsx:36` calls
   `getUser()` (cookie read) during render of the root client layout, and
   `Navbar.tsx:44-46,58` re-reads it in `useEffect` behind a `hydrated` flag.
   Server HTML is rendered with no user; client re-renders with the user →
   guaranteed auth flicker on every navigation.

### 🟠 Architectural

6. **The entire application is a Client Component subtree.** `app/layout.tsx`
   (server) renders `<ClientLayout>` (`Client.tsx:1` `"use client"`) which wraps
   `{children}` for _every_ route. RSC, streaming, and server data fetching are
   structurally impossible below the root. 97 of 255 files carry `"use client"`.
7. **No single API layer.** Base URLs are hardcoded and inconsistent:
   `http://localhost:6565` (`app/lib/authService.ts`), `https://link.com`
   (`app/lib/projectService.ts` — placeholder, dead), `api-sabi.langitdigital78.com`
   (`app/lib/profileService.ts`), `api-staging-capbridge…` (NextAuth route),
   alongside the env-based `app/utils/constant.ts`. Two axios instances
   (`utils/axios.ts`, `utils/axios_media.ts`) duplicate ~150 lines of identical
   refresh-token logic.
8. **Two parallel `utils/` trees and three "helper" buckets.** `utils/` (root:
   `axios.ts`, `axios_media.ts`, `logger.ts`) vs `app/utils/` (constants, format,
   sockets, fetchers) vs `app/lib/` (services) vs `app/helper/`
   (cookie/modal/upload). Responsibilities overlap with no rule for what goes
   where. `@lib/*` alias points at `app/lib`, but services also live in
   `app/utils`.
9. **Business/data logic inside UI components.** The same profile endpoint is
   fetched independently in 8+ components (`Navbar`, `DashboardView`,
   `ProfileView`, `CreateProjectPenerbit`, `FormPemodal`,
   `FormDataPemodalPerusahaan`, `FormPemodalPerusahaan`, `PenerbitParent`).
   Dashboard and inbox endpoints are likewise fetched in many places.
10. **Routing structure reflects accumulated chaos.** A `(defaults)` group _and_
    an un-grouped `app/dashboard/` tree coexist; `app/features/` is a leftover
    template (e.g. `app/features/phising/page.tsx` is a generic "Under
    Construction" screen — nothing to do with crowdfunding). Footer visibility is
    a 16-entry hardcoded `pathname ===` chain in `Client.tsx:60-76`.

### 🟡 Quality

11. **`any` everywhere.** ~147 occurrences across `app/`+`redux/`. Catch blocks
    are uniformly `catch (e: any)`; cookie helpers take `(key: any, value: any)`.
12. **Versioned dead duplicates.** `Home.tsx` _and_ `HomeV2.tsx` are both
    imported; `RegisterV2`, `FooterV2`, `Navbar`, `DataPemodalPerusahaanV1`
    coexist with predecessors. Old versions linger as dead/confusing code.
13. **`Swal.fire` as the error layer.** Every service swallows errors into a
    SweetAlert toast (`authService`, `profileService`, `projectService`, …),
    mixing transport, error handling, and UI in one function. No consistent
    error model.
14. **Mixed naming + magic values.** `PymentManual.tsx` (typo), Indonesian +
    English identifiers mixed, hex colors hardcoded per component
    (`Navbar.tsx:30-32`), localized comments throughout.
15. **`reactStrictMode: false`** (`next.config.mjs:3`) hides double-invoke bugs.
16. **`react-strict-dom`-unfriendly raw `<img>`** in 6 files; layout-shift risk
    where `next/image` should be used.

---

## 3. TARGET ARCHITECTURE

**Organizing axis: feature-based hybrid** (see Decisions Log §10-D10). Domain code
is grouped by feature; only genuinely cross-feature code lives in `shared/`. This
supersedes the earlier layer-based sketch (`components/ui` + flat `services/` +
`lib/` as top-level), which is rejected — do not reintroduce it.

> **Execution status is tracked in `MIGRATION.md`** (a temporary, deletable
> checklist). This section is the binding *target*; `MIGRATION.md` is only the
> *how/when*. When the migration completes, `MIGRATION.md` is deleted and this
> charter remains the single source of truth.

```
web_fulusme/
├── next.config.mjs               # No webpack overrides. Images + headers only.
├── src/                          # Single application root (kills the dual-utils problem)
│   ├── proxy.ts                  # Edge auth gate (Next 16). MUST live in src/ now app is under src/ — Next only registers it here. Reads httpOnly cookie only.
│   ├── app/                      # ROUTING ONLY — thin page/layout, server data orchestration. No business logic.
│   │   ├── layout.tsx            # Server root. Providers in thin client wrapper (providers.tsx).
│   │   ├── (marketing)/          # Public: home, about, terms, privacy, business-list, pasar-sekunder, sukuk
│   │   ├── (standalone)/         # Bare, no chrome: viewer
│   │   ├── (auth)/               # login, register, forgot/change password
│   │   ├── (dashboard)/          # Authenticated app. ONE dashboard tree (merge app/dashboard + (defaults))
│   │   └── api/
│   │       ├── auth/             # Login/logout/refresh route handlers → set httpOnly cookies
│   │       └── (bff)/            # Thin proxy handlers if/when needed
│   ├── features/                 # ← the heart. One folder per domain, self-contained.
│   │   ├── auth/                 #   components/  services/  hooks/  types.ts  per feature
│   │   ├── profile/
│   │   ├── dashboard/
│   │   ├── inbox/
│   │   ├── project/             #   create-project, sukuk, penerbit forms, dokumen
│   │   ├── investor-form/       #   pemodal / pemodal-perusahaan forms
│   │   ├── payment/
│   │   ├── transaction/        #   + portfolio
│   │   └── content/            #   home, about, CMS-driven pages
│   ├── shared/                   # Cross-feature ONLY — belongs to no single domain
│   │   ├── ui/                   #   Button, Modal, Tooltip, Pagination, GridView (pure presentation)
│   │   ├── lib/
│   │   │   ├── api-client.ts     #   The ONLY axios/fetch wrapper. baseURL param (backend vs media).
│   │   │   ├── auth/             #   session read helpers (server-only)
│   │   │   ├── format/           #   rupiah, date, npwp, filetype — pure functions
│   │   │   └── lookups/          #   wilayah / jenis-usaha / status — 'use cache' candidates
│   │   ├── hooks/                #   useOnlineStatus, useLocalStorage, …
│   │   └── types/                #   cross-feature API response + domain primitives
│   └── store/                    # RTK store + slices (UI/client state only)
└── .env.example                  # Committed template. Real .env* are gitignored.
```

**Feature module rule:** one feature = one folder owning its `components/`,
`services/`, `hooks/`, `types.ts`. Code used by ≥2 features graduates to
`shared/` — not before.

**Cross-feature import rule:** `features/A` must NOT import `features/B` at
runtime. The only exception is **type-only** imports (`import type …`), which
carry no runtime coupling. Anything shared at runtime goes through `shared/` or
is passed down from a page.

**Created:** `src/`, `src/features/*`, `src/shared/{ui,lib,hooks,types}`,
`src/store`, `shared/lib/api-client.ts`, `.env.example`.
**Reorganized:** `app/interfaces` → `shared/types` (+ per-feature `types.ts`);
`app/lib` + `app/utils` + root `utils` + `app/helper` collapse into `shared/lib`
+ per-feature `services/`; `redux` → `src/store`; `(defaults)` split into
`(marketing)`/`(auth)`/`(dashboard)`.
**Deleted:** `app/features/*` template pages (verify each; keep `broadcast`,
`register`), dead `projectService.ts` (`link.com`), `profileSlice` &
`projectSlice` (never imported by `store.ts`), the second axios instance after
unification, the stray `app/src/react-step.tsx`.

> Non-negotiable minimum if the full move can't land at once: introduce
> `shared/lib/api-client.ts` and collapse the two `utils/` trees first.

---

## 4. LAYER ARCHITECTURE & RULES

Layers cut *across* features. Within a feature folder the same rules apply to its
`components/`, `services/`, `hooks/`, `types.ts`.

| Layer                              | Single responsibility                             | May import                                 | May NOT import                                                            |
| ---------------------------------- | ------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------- |
| `app/**/page.tsx`, `layout.tsx`    | Routing, data orchestration (server), composition | feature services + components, `shared`    | another page; `js-cookie`                                                 |
| `features/*/components`            | Feature UI, local interactivity                   | own feature, `shared/ui`, `shared/hooks`, `store` | another feature's components; services directly for first-paint fetching (receive data via props/Server Components) |
| `features/*/services`              | One domain's API calls, typed in/out              | `shared/lib/api-client`, types             | React, components, `Swal`, `js-cookie`                                    |
| `shared/ui`                        | Pure presentation                                 | nothing app-specific                       | features, services, store, `next/navigation` data                        |
| `shared/lib/api-client`            | HTTP transport + auth header + refresh            | types, env                                 | components, store, features                                               |
| `shared/lib/*`                     | Pure cross-feature helpers                        | types                                      | features, components, store                                               |
| `store`                            | Client/UI state only                              | types                                      | components (except via thunks that call services)                        |
| `shared/types`, `features/*/types` | Type definitions only                             | nothing                                    | everything (leaf)                                                        |

**Hard rules**

- A component never constructs a URL or calls `axios` directly. It calls a
  service, or (preferably) receives server-fetched data as props.
- `Swal`/toast lives in components, never in services. Services throw typed
  errors.
- Auth token access is server-only. No `getToken()`/`getUser()` reading cookies
  in client code after the auth migration.
- `features/A` never imports `features/B` at runtime — only `import type`. Share
  runtime code via `shared/` or props from a page.
- "Where does this go?" — if it serves one domain → that feature; if ≥2 →
  `shared/`. There is no `utils/` or `helper/` bucket anymore.

---

## 5. AUTHENTICATION — CURRENT VS TARGET

### Current (exact)

- Login posts credentials and the response is written to a **plaintext** cookie:
  `app/lib/auth.ts:16-18` `saveAuthUser` → `Cookies.set("user", JSON.stringify(auth))`.
- Token also duplicated in a `token` cookie, read by `app/lib/utils.ts:18`
  `getToken()` and by `app/lib/profileService.ts:7,32`.
- Axios injects the token from the cookie on every request:
  `utils/axios.ts:49` `getUser()?.token`; refresh logic re-writes the cookie
  (`utils/axios.ts:133`).
- Edge gate `proxy.ts` parses the same cookie for routing _and_ role checks.
- A NextAuth v4 credentials route also exists
  (`app/api/auth/[...nextauth]/route.ts`) hitting a _different_ host, with a
  missing `NEXTAUTH_SECRET` — effectively a parallel, half-wired auth system.

### Why flicker exists now

Server renders with no knowledge of the cookie's contents (it never reads it for
UI), `ClientLayout`/`Navbar` read `getUser()` only in the browser → first paint
is "logged out", second paint is "logged in".

### Target — Next.js 16 `httpOnly` + `proxy.ts` Thin Proxy

1. A Route Handler (`app/api/auth/login`) calls the backend, then sets the
   session as `httpOnly`, `secure`, `sameSite=lax` cookies via
   `cookies()` from `next/headers`. The refresh token is `httpOnly` and never
   reaches JS.
2. `proxy.ts` validates the **httpOnly** session cookie (presence + signature/
   claims) for route protection. Role checks read a signed/server-trusted value,
   not client JSON.
3. Server Components read the session via `cookies()` and pass auth state down,
   so the **first server render already knows** the user — flicker disappears
   because there is no client-side "discovery" step.
4. `lib/api-client` (server variant) attaches the token from `cookies()`;
   refresh happens via a server route, not in a browser axios interceptor.
5. Retire one of the two auth systems. **Decision:** keep the custom
   cookie+proxy flow (it matches the existing multi-host backend) and delete the
   NextAuth v4 route, OR migrate fully to Auth.js v5 — see Decisions Log §10-D2.

---

## 6. NEXT.JS 16 — BREAKING CHANGES CHECKLIST (only what affects this repo)

| Change                                                 | Affects this repo?                  | Location / status                                                                                                                        |
| ------------------------------------------------------ | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| React 19 required                                      | **RESOLVED** ✅                      | `package.json` now react/react-dom 19.1.0, `@types/react` 19.                                                                            |
| `middleware.ts` → `proxy.ts`                           | Already migrated                    | `proxy.ts` present, no `middleware.ts`. ✅ but logic insecure (§5).                                                                      |
| Async `params`/`searchParams`                          | Partially handled                   | Dynamic routes already `await params` (`sukuk/[projectId]/page.tsx`, `payment-manual/[id]/page.tsx`, `payment-method/[id]/page.tsx`). ✅ |
| `next/image` defaults / `<img>`                        | Minor                               | 6 raw `<img>` files to convert.                                                                                                          |
| Caching defaults (`fetch` no longer cached by default) | Relevant when adding server fetches | Adopt explicit `'use cache'` / `revalidate` in new server fetchers.                                                                      |
| `next lint` deprecation                                | Low                                 | `package.json:9` still uses `next lint`; migrate to ESLint CLI (eslint 9 + `eslint-config-next 16` already present).                     |
| `reactStrictMode`                                      | Quality                             | Currently `false`; turn on after React 19 upgrade.                                                                                       |

---

## 7. DATA FETCHING RULES

### Confirmed duplication (fix targets)

- **Profile** fetched independently in: `Navbar.tsx`, `DashboardView.tsx`,
  `ProfileView.tsx`, `CreateProjectPenerbit.tsx`, `FormPemodal.tsx`,
  `FormDataPemodalPerusahaan.tsx`, `FormPemodalPerusahaan.tsx`,
  `PenerbitParent.tsx`, plus `app/lib/profileService.ts`.
- **Dashboard (investor)** fetched in `Client.tsx`, `DashboardView.tsx`,
  `PortfolioView.tsx`, `PaymentMethod.tsx`, `WaitingPayment.tsx`,
  `sukuk/[projectId]/client.tsx`, `dashboard/layout.tsx`, plus thunk.
- **Inbox** fetched in `Navbar`, `DashboardView`, `Home`, `Inbox`,
  `Transaction`, `PymentManual`, `dashboard/layout.tsx`, plus thunk.

### Target pattern

1. **Default to Server Components.** Fetch in `page.tsx`/`layout.tsx` on the
   server, pass data down. Profile/dashboard/inbox should be fetched once per
   route at the layout level and shared via props or a context populated on the
   server.
2. **`lib/api-client.ts`** is the only transport. Server variant reads token from
   `cookies()`; client variant (for genuinely interactive mutations) calls a
   route handler. One refresh implementation, not two.
3. **Services** (`services/profile.ts`, `services/dashboard.ts`,
   `services/inbox.ts`) own endpoints + types and throw typed errors.
4. **React Query/SWR**: introduce _only_ for client-side, frequently-mutating,
   user-interactive data (e.g. live inbox badge over socket). Not for
   first-paint data — that is the server's job. Do not add it project-wide.
5. **`'use cache'`** for static-ish reads (wilayah/region lists
   `fetchWilayah.ts`, jenis-usaha/perusahaan lookups in `app/utils/fetch*.ts`)
   which currently re-fetch on every mount.

---

## 8. COMPONENT RULES

### Confirmed duplicates

- `home/Home.tsx` (V1, imported by `(defaults)/page.tsx`) **and**
  `home/HomeV2.tsx` both live; consolidate to one and delete the loser.
- `RegisterV2`/`FooterV2`/`Navbar`/`DataPemodalPerusahaanV1` — drop the version
  suffix and delete superseded files once a single canonical version is chosen.
- Form validation logic is duplicated across `FormPemodal`,
  `FormPemodalPerusahaan`, `FormDataPemodalPerusahaan`, `FormPenerbit` — extract
  shared Zod schemas into `lib/validation/` (Zod + `@hookform/resolvers` already
  installed).

### `"use client"` decision table

| Situation                                              | Directive?                                                       |
| ------------------------------------------------------ | ---------------------------------------------------------------- |
| Uses `useState`/`useEffect`/event handlers/browser API | ✅ client                                                        |
| Reads `usePathname`/`useRouter`/`useSearchParams`      | ✅ client (leaf only)                                            |
| Only renders props/children, no interactivity          | ❌ server                                                        |
| Wraps the whole app to provide Redux/socket            | ✅ but make it the **thinnest possible leaf**, not the root tree |
| Needs auth/session for first paint                     | ❌ server — read `cookies()`                                     |

**Rule:** push `"use client"` to the leaves. `ClientLayout` must shrink to a
provider shell; pages and static sections become Server Components.

---

## 9. ANTI-PATTERNS — FORBIDDEN IN THIS CODEBASE

| Pattern                                   | Found In                                                                   | Severity      | Why Forbidden                      | Correct Approach                                |
| ----------------------------------------- | -------------------------------------------------------------------------- | ------------- | ---------------------------------- | ----------------------------------------------- |
| Auth token in JS-readable cookie          | `app/lib/auth.ts`, `app/lib/utils.ts:18`, `app/helper/cookie.ts`           | Critical      | XSS-exfiltratable; trusted by edge | `httpOnly` cookies via `next/headers`           |
| Authorization decided from client cookie  | `proxy.ts:27`, `app/hooks/useRole.ts`                                      | Critical      | User can forge role                | Server-trusted/signed session claims            |
| Reading auth in `useEffect`/render for UI | `Client.tsx:36`, `Navbar.tsx:44-58`                                        | Critical      | Hydration flicker                  | Server reads session, passes as props           |
| Hardcoded API base URL                    | `authService.ts`, `profileService.ts`, `projectService.ts`, nextauth route | Architectural | Env drift, un-switchable           | `lib/api-client.ts` + `NEXT_PUBLIC_API_BACKEND` |
| `axios` called directly in a component    | 15 files importing axios                                                   | Architectural | No central auth/error/refresh      | Call a service                                  |
| Data fetched in UI component              | profile/dashboard/inbox (§7)                                               | Architectural | Duplicate requests, no caching     | Fetch in `page`/`layout` (server)               |
| Whole-app `"use client"` root             | `Client.tsx`                                                               | Architectural | Disables RSC for all routes        | Thin provider leaf                              |
| `Swal.fire` inside service functions      | all `app/lib/*Service.ts`                                                  | Quality       | Couples transport to UI            | Throw typed error; toast in component           |
| `catch (e: any)` / pervasive `any`        | ~147 sites                                                                 | Quality       | No type safety                     | `unknown` + narrowing; typed responses          |
| Versioned duplicate components (`V1/V2`)  | home/register/footer/navbar                                                | Quality       | Dead, confusing code               | One canonical component                         |
| Magic pathname chains                     | `Client.tsx:60-76`                                                         | Quality       | Fragile, unscalable                | Route-group layouts decide chrome               |
| Two parallel `utils/` trees               | `utils/` + `app/utils/`                                                    | Architectural | No "where does it go" rule         | Single `lib/` + `services/`                     |
| Committing `.env*`                        | tracked `.env`, `.env.development`, `.env.production`                      | Critical      | Secret leakage risk                | `.env.example` only; gitignore rest             |

---

## 10. DECISIONS LOG

**D1 — Upgrade React to 19 before anything else.**
_Found:_ React 18.3.1 with Next 16. _Decided:_ Bump `react`, `react-dom` to 19
and `@types/react(-dom)` to 19 as Phase 1, step 1. _Why:_ Next 16's compiler and
APIs assume React 19; running on 18 is unsupported and the source of latent
runtime issues. _Alternative rejected:_ pin Next back to 15 — rejected because
the migration intent (proxy.ts, Next 16 features) is explicit and downgrading
discards completed work.

**D2 — Keep custom cookie+proxy auth; delete NextAuth v4 route.**
_Found:_ Two half-wired auth systems on different hosts; `NEXTAUTH_SECRET`
missing. _Decided:_ Standardize on the custom flow but move tokens to `httpOnly`
cookies set by a Route Handler, and remove `app/api/auth/[...nextauth]/route.ts`.
_Why:_ The app already depends on multi-host backends and a refresh-token dance
that NextAuth v4 isn't wired for; v4 is also EOL for App Router. _Alternative
rejected:_ migrate to Auth.js v5 now — viable long-term, but it is a second large
migration competing with the React 19 + httpOnly work; defer to a later phase
(noted in Open Questions).

**D3 — Move source into `src/`.**
_Found:_ Root `utils/` vs `app/utils/`, root `redux/`, files at repo root. _Decided:_
Adopt `src/` as the single application root. _Why:_ Eliminates the dual-utils
ambiguity structurally and is the Next 16 recommended layout. _Alternative
rejected:_ keep root `app/` and just merge utils — leaves two competing
conventions and the root-clutter problem.

**D4 — One `api-client`, one axios instance.**
_Found:_ `utils/axios.ts` and `utils/axios_media.ts` duplicate refresh logic.
_Decided:_ Single `lib/api-client.ts` with a `baseURL` parameter (backend vs
media). _Why:_ ~150 lines of copy-paste with subtle drift (media instance lacks
the `AUTH_ENDPOINTS` guard). _Alternative rejected:_ keep both — guarantees the
two drift further.

**D5 — Server Components are the default; React Query is opt-in.**
_Found:_ Everything fetched client-side, often duplicated. _Decided:_ First-paint
data fetched in server `page`/`layout`; React Query only for interactive/live
client data. _Why:_ Removes flicker, dedupes requests, leverages Next 16 caching.
_Alternative rejected:_ adopt React Query everywhere — keeps the all-client
architecture and its flicker.

**D6 — Delete `app/features/` template tree.**
_Found:_ `app/features/{phising,gsm-tracker,nik,pln,e-wallet,…}` are generic
"Under Construction" placeholders unrelated to crowdfunding. _Decided:_ Remove
after confirming none are linked from production nav. _Why:_ Dead surface area,
confusing, and `phising`-named routes are a reputational/security smell.
_Alternative rejected:_ keep "in case" — dead code rots.

**D7 — Errors are thrown, not toasted, in services.**
_Decided:_ Services throw typed errors; components decide UI (Swal/toast/inline).
_Why:_ Reusability and testability; current pattern can't be used in a Server
Component (Swal is browser-only). _Alternative rejected:_ status quo.

**D8 — `.env*` untracked; commit `.env.example`.**
_Decided:_ `git rm --cached` the env files, add `.env*` to `.gitignore` (keep
`!.env.example`). _Why:_ Prevents future secret leaks even though current values
are public. _Alternative rejected:_ leave tracked — unsafe the day a real secret
is added.

**D9 — Re-enable `reactStrictMode` after the React 19 upgrade.**
_Decided:_ Flip to `true` once on React 19. _Why:_ Surfaces effect/lifecycle bugs
the disabled flag is currently hiding.

**D10 — Organize `src/` by feature, not by layer.**
_Found:_ §3/§4 originally sketched a layer-based `src/` (`components/ui` +
`components/features` + flat `services/` + `lib/` as siblings). _Decided:_ Adopt a
**feature-based hybrid**: `src/features/<domain>/{components,services,hooks,types}`
for domain code + `src/shared/{ui,lib,hooks,types}` for cross-feature code +
`src/store`. _Why:_ The domains here are sharp and already half-grouped
(`app/interfaces` is per-domain), so colocating a feature's UI + data + types is
more navigable and scales better than a flat services/components split; it also
makes "where does this go?" answerable by a single question (one domain →
feature, ≥2 → shared). _Guardrail:_ no runtime `features/A → features/B` imports
(type-only allowed), preventing the cross-coupling that pure feature folders
risk. _Alternative rejected:_ the layer-based layout in the original §3 — valid,
but groups by mechanism rather than by the thing a developer actually navigates
(a feature), and tends to scatter one change across `components/`, `services/`,
`types/`. _Execution:_ tracked in `MIGRATION.md`; this supersedes the prior §3/§4.

---

## 11. REFACTORING PRIORITY ORDER

**Phase 0 — Stop the bleeding (security + build)**

1. Upgrade React/React-DOM/types to 19; get a green `next build` (D1).
2. `git rm --cached` `.env*`; add `.env.example`; fix `.gitignore` (D8).
3. Move auth tokens to `httpOnly` cookies set by a login Route Handler; remove
   `getToken`/`saveAuthUser` plaintext writes (D2, §5).
4. Rewrite `proxy.ts` to validate the httpOnly session and stop trusting
   client-parsed `role` (§5).

**Phase 1 — Auth correctness & flicker** 5. Read session server-side in the root layout; pass auth down. Shrink
`ClientLayout` to a provider-only leaf (D5, §8). 6. Delete NextAuth v4 route or wire `NEXTAUTH_SECRET` — per D2, delete.

**Phase 2 — Data layer** 7. Introduce `lib/api-client.ts`; collapse the two axios instances (D4). 8. Build typed `services/*`; remove hardcoded hosts and `Swal` from services
(D7). Replace `https://link.com` dead service. 9. De-duplicate profile/dashboard/inbox fetching into server `layout`-level
reads (§7).

**Phase 3 — Structure & types** 10. Move to `src/`; merge `utils`/`lib`/`helper`; `interfaces` → `types` (D3). 11. Kill dead code: `app/features/*` (D6), `profileSlice`/`projectSlice`, V1
duplicates. 12. Burn down `any` (147 sites) starting at the new service/type boundary.

**Phase 4 — Polish** 13. `reactStrictMode: true` (D9); raw `<img>` → `next/image`; extract shared Zod
schemas; replace magic pathname chains with route-group layouts; migrate
`next lint` → ESLint CLI.

> Phases 0–1 must land before any feature work. Phases 2–4 can interleave per
> feature touched.

---

## 12. OPEN QUESTIONS

Only genuinely undecidable-from-code items:

1. **Backend topology.** Code references `api-staging-capbridge`, `api-sabi`,
   `api.gateway.langitdigital78.com`, `api.wilayah.site`, and `localhost:6565`.
   Which of these is the canonical production backend, and are the others
   intentional third-party services (region lookup, media, payment gateway) or
   stale? This determines how many base URLs `api-client` needs.
2. **Auth.js v5 timing (D2).** Decided to keep custom auth now; is there
   appetite to migrate to Auth.js v5 in a later cycle, or is the custom flow
   permanent? Affects whether Phase 1 invests in reusable session primitives.
3. **`app/features/` (D6).** Confirm none of these routes are sold/linked
   externally before deletion.
4. **Refresh-token storage.** Backend currently returns a `refresh` token used
   client-side. Can the backend set/rotate it as an `httpOnly` cookie itself, or
   must Next proxy every refresh? Determines whether refresh logic lives in a
   route handler or is delegated.

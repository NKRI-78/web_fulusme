# MIGRATION.md — `src/` Feature-Based Hybrid Migration

> **Temporary execution tracker.** The binding *target & rules* live in
> [CLAUDE.md](./CLAUDE.md) §3, §4, and Decision D10 — this file is only the
> *how/when* checklist. **Delete this file once the migration reaches 100%.**

**Goal:** move the whole app into `src/`, organized by feature
(`src/features/*`) with a cross-feature `src/shared/*` layer, per CLAUDE.md §3.

## Operating rules (do not break)

- **One feature = one commit.** Every commit must produce a green `next build`.
- **`git mv` for every move** — preserve history & `git blame`.
- **Alias-first:** when a file moves, rewrite its imports to `@features/*` /
  `@shared/*` / `@store/*` — never leave `../../` relative imports behind.
  (190 relative imports across 70 files today; this migration eliminates them.)
- **`features/A` ↛ `features/B`** at runtime. `import type` across features is OK.
- **Scope = structure only.** The 43 files importing `axios` directly and the
  ~100 `Swal.fire` call sites in *components* are NOT fixed here — see
  [Out of scope](#out-of-scope). Only `Swal` inside *services* is removed when
  that service moves.
- Between large phases, clear Turbopack cache: `rm -rf .next`.

## Target aliases (`tsconfig.json`)

```jsonc
"@/*":         ["./src/*"],
"@features/*": ["./src/features/*"],
"@shared/*":   ["./src/shared/*"],
"@store/*":    ["./src/store/*"],
"@app/*":      ["./src/app/*"]
```

Old aliases (`@lib`, `@components`, `@interfaces`, `@hooks`, `@redux`) stay alive
**alongside** the new ones during migration, removed only in Phase F after grep
confirms zero usage.

---

## Phases

### Phase A — Foundation _(1 commit)_ — PR #1
- [ ] Create empty `src/`; add new aliases to `tsconfig.json` beside the old ones.
- [ ] Audit `next.config.mjs` for root path assumptions.
- [ ] Delete dead `app/features/*` template tree **except** `broadcast` & `register` (relocate those later).
- [ ] Resolve `app/src/react-step.tsx` (find user → relocate or delete).
- [ ] Verify & delete unused slices (`projectSlice`, `profileSlice` if present).
- [ ] `next build` green → commit `chore(struct): src scaffold + aliases, drop dead features tree`.

### Phase B — `shared/` _(1 commit)_ — PR #1
- [ ] `shared/lib/api-client.ts` ← `app/lib/api-client.ts`; fold `utils/axios.ts` + `utils/axios_media.ts` into it via `baseURL` param.
- [ ] `shared/lib/format/` ← `price.ts`, `npwp-formart.ts` (→ `npwp.ts`), `fileType.ts`, `formatRupiah.ts`.
- [ ] `shared/lib/lookups/` ← `fetchWilayah.ts`, `fetchJenisUsaha.ts`, `fetchJenisPerusahaan.ts`, `fetchStatusPerushaan.ts`.
- [ ] `shared/lib/` ← `storage.ts`, `utils.ts`, `cookie.ts`, `constant.ts`, `sockets.ts`, `logger.ts`, `tokenCache.ts`.
- [ ] `shared/ui/` ← `Button`, `Tooltip`, `GeneralDialog`, `pagination/*`, `GridView`, `Center`, `CircularProgressIndicator`.
- [ ] `shared/hooks/` ← `useOnlineStatus`, `useLocalStorage`, `useFileViewerModal`.
- [ ] `shared/types/` ← all `app/interfaces/*` + root `types/next-auth.d.ts`.
- [ ] Rewrite all importers → `@shared/*`. `next build` green → commit.

### Phase C — `store/` _(1 commit)_ — PR #1
- [ ] `redux/` → `src/store/` (`store.ts` + `slices/`).
- [ ] Rewrite `@redux/*` → `@store/*`. Drop dead slices.
- [ ] `next build` green → commit.

> **PR #1 = Phases A + B + C** (foundation). Features land in later PRs.

### Phase D — Features _(one commit each)_ — PR #2+
Order: most independent → most dependent.

- [ ] **D1 `auth`** — `components/auth/*` (rename `RegisterV2`→`Register`), `lib/auth.ts`, `hooks/useRole.ts`, `(defaults)/auth/*`, `providers/session-*`.
- [ ] **D2 `profile`** — `components/auth/profile/*`, `services/profile.ts`, `(defaults)/profile`.
- [ ] **D3 `inbox`** — `components/notif/*`, `services/inbox.ts`.
- [ ] **D4 `dashboard`** — `components/dashboard/*`, `services/dashboard.ts`; merge `app/dashboard` + `(defaults)` dashboard bits into ONE tree.
- [ ] **D5 `project`** — `components/createProjectPenerbit/*`, `inputFormPenerbit/*`, `formDokumenTambahanPenerbit/*`, `sukuk/*`, `lib/projectService.ts` (**remove Swal**), `(defaults)/{create-project,form-penerbit,sukuk}`.
- [ ] **D6 `investor-form`** — `inputFormPemodal/*`, `inputFormPemodalPerusahaan/*` (drop `DataPemodalPerusahaanV1`), `(defaults)/form-pemodal*`.
- [ ] **D7 `payment`** — `(defaults)/{payment-method,payment-manual,waiting-payment}`, payment bits in `components/sukuk`.
- [ ] **D8 `transaction` / `portfolio`** — `components/portfolio/*`, dashboard transaction views, `(defaults)/transaction`.
- [ ] **D9 `content`** — `components/content/*`, `lib/contentService.ts` (**remove Swal**), `components/home/*` (rename `HomeV2`→`Home`; V1 already gone).

Each: `git mv` → rewrite imports (relative→alias) → `next build` green.

### Phase E — Routing & app shell _(1 commit)_ — PR (final)
- [ ] Split `(defaults)` → `(marketing)` / `(auth)` / `(dashboard)`.
- [ ] Shrink `Client.tsx` to a provider-only shell; replace the `pathname ===` footer chain with route-group layouts.
- [ ] Move `app/layout.tsx`, `not-found.tsx`, `globals.css`, `fonts`, `favicon` → `src/app/`.

### Phase F — Final cleanup _(1 commit)_ — PR (final)
- [ ] Delete now-empty: `app/lib`, `app/utils`, `app/helper`, `utils/`, `redux/`, `app/interfaces`, `app/services`, `app/providers`, `app/src`.
- [ ] Remove old aliases from `tsconfig.json` (grep-confirm 0 usage).
- [ ] Confirm CLAUDE.md §3/§4/D10 still match reality.
- [ ] **Delete this MIGRATION.md.**
- [ ] `next build` + manual smoke test.

---

## Out of scope (follow-up: "Phase 2 continued")

These are real debt but deliberately excluded to keep this migration reviewable:

- **43 files import `axios` directly** → should route through a feature service.
- **~100 `Swal.fire` in components** → fine to keep in components per D7; only
  service-level Swal is removed here.
- `'use cache'` on `shared/lib/lookups/*` (moved here, not yet cache-annotated).
- Raw `<img>` → `next/image` (6 files), `next lint` → ESLint CLI.

## Decisions captured during planning

- Home: only `HomeV2.tsx` exists (V1 already deleted) → rename to `Home` in D9.
- `app/features/{broadcast,register}` are live → relocate, don't delete.
- PR granularity: foundation (A–C) as PR #1, features as subsequent PRs.

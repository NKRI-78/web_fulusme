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

### Phase A — Foundation _(1 commit)_ — PR #1 ✅ DONE
- [x] Create `src/`; add new aliases (`@features`/`@shared`/`@store`) to `tsconfig.json` beside old ones (`@/*` left at `./*` so existing imports keep working).
- [x] Delete dead `app/features/*` template tree **except** `broadcast` (the only live one, used by `(defaults)/informasi/*`). `register` was template junk too (Under-Construction page, listed in dead `LeftSidebar` demo nav) — deleted.
- [x] Deleted dead `LeftSidebar.tsx` (zero importers; only linked to the deleted template tree).
- [x] Resolved `app/src/react-step.tsx` → it was an ambient `declare module` type, moved to `types/react-step-progress-bar.d.ts`; `app/src/` removed.
- [x] Deleted dead `redux/slices/projectSlice.ts` (not imported by `store.ts` or anywhere). `profileSlice` already gone in Phase 2.
- [x] `next build` green → commit.

### Phase B — `shared/` _(1 commit)_ — PR #1 ✅ DONE
- [x] `shared/lib/api-client.ts` ← `app/lib/api-client.ts`. `utils/axios.ts` + `axios_media.ts` already thin shims (Phase 2) — kept as shims re-exporting `@shared/lib/api-client` (37 files import `@/utils/axios`; their migration is the out-of-scope axios cleanup). `logger.ts` + `tokenCache.ts` moved too.
- [x] `shared/lib/format/` ← `price`, `npwp-formart`, `fileType`, `formatRupiah` (kept filenames; npwp rename deferred).
- [x] `shared/lib/lookups/` ← `fetchWilayah`, `fetchJenisUsaha`, `fetchJenisPerusahaan`, `fetchStatusPerushaan`, `jenisUsaha`.
- [x] `shared/lib/` ← `storage`, `utils`, `cookie`, `constant`, `sockets`, `logger`, `tokenCache`, `crop-around-label`, `mediaService` (from helper).
- [x] `shared/ui/` ← `Button`, `Tooltip`, `GeneralDialog`, `pagination`, `GridView`, `Center`, `CircularProgressIndicator`, `AnimatedWrapper`, `CountDownTimer`, `Modal`/`FileUpload`/`CompressorImage` (from helper). `app/helper` + `app/utils` now fully deleted.
- [x] `shared/hooks/` ← `useOnlineStatus`, `useLocalStorage`, `useFileViewerModal`.
- [x] `shared/types/` ← all `app/interfaces/*` (→ `src/shared/types`). Root `types/next-auth.d.ts` left in place (deleted with next-auth in D1).
- [x] Rewrite all importers → `@shared/*` (sed pass over 96 files + 7 relative stragglers). `tsc --noEmit` 0 errors, `next build` green → commit.
- ⚠️ Cross-layer debt to fix in feature phases: ~~`shared/lib/mediaService`→`app/lib/auth`~~ RESOLVED in D1 (auth.ts → shared/lib). Remaining: `shared/hooks/useFileViewerModal`→viewer component, `shared/ui/FileUpload`→`inputFormPenerbit/SectionPoint`. Resolve when those features migrate.

### Phase C — `store/` _(1 commit)_ — PR #1 ✅ DONE
- [x] `redux/` → `src/store/` (`store.ts` + `slices/`). Dead `projectSlice` already dropped in Phase A.
- [x] Rewrite `@redux/*` and `@/redux/*` → `@store/*` (12 files). Old `@redux/*` alias left in tsconfig (unused; removed in Phase F).
- [x] `tsc --noEmit` clean, `next build` ✓ compiled successfully → commit.

> **PR #1 = Phases A + B + C** (foundation) ✅ COMPLETE. Features land in later PRs.

### Phase D — Features _(one commit each)_ — PR #2+
Order: most independent → most dependent.

- [x] **D1 `auth`** ✅ — `components/auth/{login,register,forgot-password,change-password}` → `features/auth/components`; `providers/session-{provider,timeout-provider}` → `features/auth/providers`. **`lib/auth.ts` → `shared/lib/auth.ts`** (NOT features: `getUser`/`saveAuthUser`/`syncRole`/`removeAuthUser`/`SessionData` are cross-feature session helpers used by ~30 files; per CLAUDE.md §3 `shared/lib/auth`). Deleted dead `hooks/useRole.ts` (0 importers) + `components/auth/verification` (0 refs). `Register` (page) ≠ `RegisterV2` (modal `RegisterForm`) — NOT dup versions, both kept (rename deferred). `components/auth/profile` left for D2. Route pages in `(defaults)/auth/*` stay until Phase E (imports updated). tsc clean, build ✓.
- [x] **D2 `profile`** ✅ — `components/auth/profile/*` (ProfileView + 3 sub-views) → `features/profile/components`; `services/profile.ts` → `features/profile/services` (typed getProfile/updateProfile — 0 importers yet, ProfileView still fetches via raw `@/utils/axios`; wiring = axios-cleanup follow-up). `app/components/auth` now empty/removed. Route `(defaults)/auth/profile` stays until Phase E. **New debt:** 2 profile sub-views import `FormButton` from `inputFormPenerbit/_component` via `@/app/...` — FormButton has 11 cross-feature importers (2 dup copies); promote to `shared/ui` (dedup) in D5/D6. tsc clean, build ✓.
- [x] **D3 `inbox`** ✅ — `notif/{inbox/Inbox,InboxCard,InboxEmpty,InboxModalDialog}` → `features/inbox/components`; `notif/inbox-interface.ts` → `features/inbox/types.ts`; `services/inbox.ts` → `features/inbox/services`; `providers/socket-provider.ts` → `features/inbox/providers` (`app/providers` now empty/removed). `notif/transaction/Transaction.tsx` left in place (transaction domain → D8). **New debt:** Transaction (D8) now imports InboxCard/InboxEmpty/InboxResponse from `@features/inbox` (cross-feature) — InboxCard/InboxEmpty are runtime cross-feature; consider promoting to shared/ui or keep type-only when D8 runs. tsc clean, build ✓.
- [x] **D4 `dashboard`** ✅ — entire `components/dashboard/*` tree → `features/dashboard/components` (wholesale; internal relatives preserved); `services/dashboard.ts` → `features/dashboard/services`. `app/services` now empty/removed (all 3 services migrated). Route pages (`app/dashboard/*`, `(defaults)`) import repointed; tree MERGE deferred to Phase E. **Parked under features/dashboard but really D8 domain:** `pemodal/PortfolioView`, `pemodal/TransactionInvestorView`, `pemodal/components/ButtonRefund` — revisit in D8. **New @/app debt (outward refs in moved tree):** PanelContent→FormButton, DashboardPemodal/Perusahaan/ExploreProjectView→`project/ProjectCard`, PortfolioView→`portfolio/PortfolioCard`. tsc clean, build ✓.
- [x] **D5 `project`** ✅ — `components/createProjectPenerbit/*`, `inputFormPenerbit/*`, `formDokumenTambahanPenerbit/*`, `sukuk/*`, `project/ProjectCard` → `features/project/components`. `lib/projectService.ts` deleted (0 importers, dead). `shared/ui/FileUpload.tsx` deleted (0 importers). **FormButton:** perusahaan version (has `type="button"`) promoted to `shared/ui/FormButton`; penerbit copy deleted; all 11 importers repointed to `@shared/ui/FormButton` — clears D2 & D4 FormButton debt. Temp @/app refs remain: GoogleMapsPicker/FormDokumenTambahanPage → `inputFormPemodalPerusahaan/component/{TextField,SectionPoint,SectionSubtitle}`; IFormPublisher.ts → `(defaults)/form-penerbit/components/PhoneInput`; dashboard→PortfolioCard (D8). tsc clean, build ✓.
- [x] **D6 `investor-form`** ✅ — `inputFormPemodal/*`, `inputFormPemodalPerusahaan/*` (kept DataPemodalPerusahaanV1 — still used by FormDataDemodalPerusahaan) → `features/investor-form/components`. **Promoted to shared/ui:** SectionPoint, SectionSubtitle, TextField, FileInput (perusahaan versions — used cross-feature by project + investor-form); cleared D5 temp refs in GoogleMapsPicker + FormDokumenTambahanPage. FormUtusanPenerbit UpdateRing ref fixed: now imports from @features/project (project-domain, identical component). DataPekerjaan/DataProbadi cross-feature FileInput → @features/project (pre-existing debt, out-of-scope). tsc clean, build ✓.
- [x] **D7 `payment`** ✅ — PaymentMethod + components, PymentManual + DetailPembayaran, WaitingPayment + components → `features/payment/components/{payment-method,payment-manual,waiting-payment}`. Deleted dead `payment-manual/PymentManual.tsx` (no-[id] stale copy; [id]/PymentManual is the live version). Route page.tsx files updated to `@features/payment/...`; PymentManual `../components/Detail` → `./components/Detail`. tsc clean, build ✓.
- [x] **D8 `transaction` / `portfolio`** ✅ — PortfolioView, TransactionInvestorView (from features/dashboard/pemodal), PortfolioCard (from app/components/portfolio), Transaction (from app/components/notif/transaction) → `features/transaction/components`. Delete ButtonRefund (0 importers, dead). Also promoted PanelContainer (pure UI, used by dashboard + transaction) → `shared/ui` (updated 6 importers). tsc clean, build ✓.
- [x] **D9 `content`** ✅ — ContentItem → features/content/components; HomeV2 renamed Home → features/content/components/Home.tsx; HelpButton → features/content/components. contentService.ts rewritten at features/content/services/contentService.ts (Swal removed, errors now propagate; raw axios + hardcoded URL left — axios-cleanup follow-up). contentSlice @lib/contentService → @features/content/services/contentService. app/lib now empty. tsc clean, build ✓.

Each: `git mv` → rewrite imports (relative→alias) → `next build` green.

### Phase E — Routing & app shell ✅ DONE (3 commits)
- [x] Split `(defaults)` → `(marketing)` / `(auth)` / `(dashboard)` + `(standalone)` (viewer). Chrome decided per audience by route-group layouts (user decision 2026-06-09: "rapikan per audience" — app/form/profile pages lose marketing footer). All URLs preserved; proxy.ts matcher unaffected.
- [x] `Client.tsx` → `src/app/providers.tsx`: thin client provider shell (Redux/Session/Socket/SessionTimeout/FileViewer + global logout modal), no chrome, no `pathname ===` chain. Geist fonts moved to `<body>` in server root layout. `/profile` made self-contained; legacy `/auth/profile` deleted. Dead shell deleted: Footer(V1), Header, app/content/Content, modal/role/Role, standalone NotifIcon.
- [x] Shell components → `src/shared/ui` (Navbar, FooterV2, Logout, ShareDialog); `features/broadcast` → `features/content/components/broadcast`. `app/components` + `app/features` removed. `@components` alias dropped.
- [x] `app/` → `src/app/` (routing-only). `@/app/...` → `@app/...`; `@app` alias → `./src/app/*`. **`proxy.ts` → `src/proxy.ts`** (Next 16 only registers the edge proxy from `src/` once app is under src/ — verified in build output; otherwise auth gate silently dropped).

### Phase F — Final cleanup _(1 commit)_ — PR (final)
- [x] Removed dead tsconfig aliases (`@redux`, `@lib`, `@hooks`, `@interfaces`, `@contexts`, `@components` — all 0 usage). `app/src/` empty dir removed.
- [ ] Delete `utils/` (2 axios shim files, root) after axios-cleanup follow-up clears the 34 `@/utils/axios` importers. **Blocked by out-of-scope axios-cleanup.**
- [ ] Move root `actions/` (4 `@/actions` importers) and `types/` (ambient `.d.ts`) into `src/`; then `@/*` could flip from `./*` to `./src/*`. **Coupled with the utils/ removal above** (all three are the last root-level `@/` targets).
- [ ] Confirm CLAUDE.md §3/§4/D10 still match reality (update §1 routing row + §2 items now resolved).
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
- Of `app/features/*`, only `broadcast` is live (used by `(defaults)/informasi/*`) → relocate in D-phase. `register` and all others were Under-Construction templates → deleted in Phase A. `LeftSidebar` (their dead nav) deleted too.
- PR granularity: foundation (A–C) as PR #1, features as subsequent PRs.

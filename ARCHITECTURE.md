# Architecture Note — Noto

A short note on how Noto is built, what I prioritized, and the tradeoffs I made
deliberately within the timebox.

## Overview

Noto is a single Next.js (App Router) application deployed on Vercel, backed by
Supabase (Postgres + Storage). Server Components read data directly through a thin
data-access layer; the browser mutates state through a small set of REST route
handlers. There is no separate backend service — the same deployment serves the UI
and the API.

```
Browser ──▶ Next.js App Router (Vercel)
              ├─ Server Components ──▶ lib/documents (data access) ──▶ Supabase Postgres
              ├─ Route Handlers (/api) ──▶ lib/access (authz) + lib/documents
              └─ Tiptap editor (client) ──▶ PATCH /api/documents/[id] (autosave)
                                   Supabase Storage ◀── /api/import (raw file)
```

## Tech stack & why

| Choice | Why |
|---|---|
| **Next.js 16 (App Router)** | One codebase for UI + API, Server Components for simple data loading, first-class Vercel deploy. |
| **Supabase (Postgres + Storage)** | Real relational persistence + object storage with zero infra to run; survives serverless (SQLite wouldn't). |
| **Tiptap 3 (ProseMirror)** | Mature, extensible rich-text engine; HTML in/out maps cleanly to storage and to file import. |
| **shadcn/ui + Tailwind 4** | Fast path to a coherent, accessible UI; themeable to the Noto brand palette via CSS tokens. |
| **Biome / Vitest** | One fast tool for lint+format; lightweight tests for the logic that matters. |

## Data model

Three tables (`supabase/schema.sql`):

- **users** `(id, name, email)` — seeded accounts (simulated auth).
- **documents** `(id, title, content_html, owner_id → users, source_filename, created_at, updated_at)`.
- **document_shares** `(document_id → documents, user_id → users, role: viewer|editor)` — composite PK `(document_id, user_id)`; cascades on delete.

Content is stored as **HTML** (Tiptap's serialization). This keeps import (md/docx
→ HTML) and rendering uniform, at the cost of not having a structured CRDT — an
acceptable tradeoff given real-time collab is out of scope.

## Request lifecycle

- **Read (pages):** Server Component → `getCurrentUser()` (signed cookie) →
  `lib/documents` query → render. Cookie usage makes these routes dynamic.
- **Write (client):** `fetch` → Route Handler → `getCurrentUser()` → load doc +
  `resolveRole()` → `canEdit`/`canManage` gate → zod-validate body → `lib/documents`
  mutation → `router.refresh()` to re-pull Server Component data.
- **Autosave:** editor `onUpdate` debounces 700ms → `PATCH /api/documents/[id]`
  with `{ html }`; title edits send `{ title }`. An inline indicator reflects
  saving/saved/error.

## Access control (the core of the product)

`src/lib/access/resolve-role.ts` is a **pure function** that maps
`(ownerId, shares, userId)` → `owner | editor | viewer | null`. Predicates
(`canView`, `canEdit`, `canManage`) build on it. Every page and route resolves a
role through this one place before acting, so authorization can't be accidentally
bypassed, and it's the single most valuable thing to unit-test. Documents the user
can't access return “not found” rather than “forbidden”, so existence isn't leaked.

## Key decisions & tradeoffs

1. **Simulated auth, real session security.** No passwords — you "log in as" a
   seeded user — but the session is a signed (HMAC-SHA256), `httpOnly` cookie with
   constant-time verification. Swapping in real auth is one module (`lib/session`)
   plus the login route.
2. **App-enforced authorization instead of RLS.** With simulated auth there's no
   Supabase JWT for `auth.uid()`, so the server uses the secret key and enforces
   access in code via `resolveRole`. In production with real auth I'd move
   enforcement into RLS policies as defense-in-depth. The secret key is server-only.
3. **HTML content over a CRDT.** Simpler storage/import/render; defers real-time
   multi-cursor collaboration (the data model already supports adding it).
4. **One query per file in the data layer.** Routes depend on intention-revealing
   calls (`getDashboardDocs`, `shareDocument`), each unit easy to read and test.
5. **Autosave over manual save** for a real doc-editor feel.

## What I deliberately left out

Real-time collaboration (Yjs/CRDT), RLS policies, document version history, and
high-fidelity `.docx` round-tripping. Rationale and "next steps" are in
[`SUBMISSION.md`](SUBMISSION.md).

## Project structure

See the "Project structure" section of [`README.md`](README.md).

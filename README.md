# Noto

A lightweight collaborative document editor — inspired by Google Docs — built for
the AI-Native Full Stack assessment. Create, edit, import, and share rich-text
documents with a clear owner/collaborator model and real persistence.

> **Live demo:** **https://noto-apps.vercel.app** · Log in as any seeded account
> (no password). Start as **Ada Lovelace** to see a document already shared with Alan.

---

## What it does

| Capability | How it works |
|---|---|
| **Create & edit** | Rich-text editor (Tiptap): bold, italic, underline, H1/H2/normal text, bulleted & numbered lists. |
| **Rename** | Inline title field in the editor header; autosaves. |
| **Save & reopen** | Debounced autosave to Postgres; content + formatting survive refresh. |
| **File upload** | Import a `.txt`, `.md`/`.markdown`, or `.docx` file → it becomes a new editable document. The original file is also stored in Supabase Storage. |
| **Sharing** | Every document has an owner. The owner can grant another user **viewer** or **editor** access by email, and revoke it. |
| **Owned vs shared** | The dashboard separates *Owned by you* from *Shared with you*, each with a role badge. |
| **Access control** | Viewers get a read-only editor; only editors can change content; only owners can share or delete. |

### Supported upload types

Only `.txt`, `.md` / `.markdown`, and `.docx` are accepted, up to **5 MB**. This is
stated in the import UI (the file picker is restricted) and enforced server-side;
anything else is rejected with a clear message.

---

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Supabase** (Postgres for data, Storage for uploaded files) via the **new API
  keys** (publishable + secret), not the legacy anon/service_role keys
- **Tiptap 3** (ProseMirror) for rich text
- **Tailwind CSS 4** + **shadcn/ui** (Luma preset) + **Tabler icons**
- **Biome** for lint/format, **Vitest** for tests
- Deployed on **Vercel**

---

## Architecture note — what I prioritized and why

The brief rewards judgment over surface area, so I optimized for a **coherent,
fully working vertical slice** rather than a broad, half-finished Google Docs
clone. Concretely:

**1. Access control is one pure function.**
`src/lib/access/resolve-role.ts` decides a user's role (`owner | editor | viewer |
null`) from a document's owner and its share rows. Every API route and page funnels
through it, and the `can*` predicates build on it. Keeping it pure (no DB, no
request context) made it the most valuable thing to unit-test and made it
impossible to accidentally bypass. This is where the real product logic lives.

**2. Simulated auth, real session security.**
Auth is intentionally simulated — you "log in as" a seeded user, no passwords — to
keep scope on documents and sharing. But the session itself is done properly: a
signed (HMAC-SHA256), `httpOnly` cookie, verified with a constant-time compare.
Swapping in real auth later means replacing one module (`src/lib/session`) and the
login route, not rewriting the app.

**3. App-enforced authorization instead of RLS — a deliberate tradeoff.**
Because auth is simulated (no Supabase JWT), there's no `auth.uid()` for Postgres
Row-Level Security to key off. So the server uses Supabase's **secret key** and
enforces access in application code via `resolveRole`. In production with real
auth, I'd push enforcement into RLS policies as defense-in-depth. The secret key is
server-only and never reaches the browser.

**4. Small, single-purpose modules.**
The data layer is one query function per file, barrel-exported, so routes depend on
intention-revealing calls (`getDashboardDocs`, `shareDocument`) rather than raw
query builders. This keeps each unit easy to read, test, and change in isolation.

**5. Autosave over manual save.**
Editing debounces a `PATCH` (700ms) with an inline save indicator. It feels like a
real doc editor and removes a whole class of "did my work save?" bugs.

### What I deliberately left out (and would do next)

- **Real-time multi-cursor collaboration** (Yjs/CRDT) — the highest-effort feature;
  out of scope for the timebox. The data model and sharing already support it.
- **RLS policies** — see tradeoff #3.
- **Document versioning / history.**
- **Granular `.docx` fidelity** — mammoth handles common formatting; complex
  layouts degrade gracefully to clean HTML.

---

## Running locally

### Prerequisites
- Node 20+ and `pnpm`
- A Supabase project (free tier is fine)

### 1. Install
```bash
pnpm install
```

### 2. Configure environment
Copy the template and fill in your Supabase values (Project Settings → API Keys):
```bash
cp .env.example .env.local
```
```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://<your-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SECRET_KEY=sb_secret_...
SESSION_SECRET=<any long random string, e.g. `openssl rand -base64 32`>
```

### 3. Provision the database
Either apply the SQL directly, or use the Supabase CLI.

**Option A — SQL editor (simplest):** paste the contents of
[`supabase/schema.sql`](supabase/schema.sql) into the Supabase SQL Editor and Run.
It creates the tables, seeds 4 users + a sample shared document, and creates the
`uploads` storage bucket.

**Option B — Supabase CLI:**
```bash
supabase login
supabase link --project-ref <your-ref>
supabase db push
```

### 4. Run
```bash
pnpm dev      # http://localhost:3000
```

### Seeded accounts
| Name | Email |
|---|---|
| Ada Lovelace | `ada@noto.test` |
| Alan Turing | `alan@noto.test` |
| Grace Hopper | `grace@noto.test` |
| Katherine Johnson | `katherine@noto.test` |

The sample document is owned by Ada and shared with Alan (editor).

---

## Testing, linting, building
```bash
pnpm test     # Vitest — access-control matrix + file-import converters
pnpm lint     # Biome
pnpm build    # production build
```

The tests focus on the two pieces of logic most worth protecting: the permission
matrix (`resolveRole` + predicates) and the file → HTML import (paragraph/heading
handling, HTML escaping, title derivation, unsupported-type rejection).

---

## Project structure
```
src/
  app/
    login/                 # seeded-user login picker
    documents/             # dashboard + /documents/[id] editor
    api/                   # REST route handlers (auth, documents, share, import)
  components/              # UI (editor, toolbar, share dialog, cards) + shadcn/ui
  lib/
    access/                # pure authorization logic (resolveRole, can*)
    auth/                  # current-user resolution
    session/               # signed-cookie session
    supabase/              # server-only Supabase client (secret key)
    documents/             # data-access layer (one query per file)
    file-import/           # txt/md/docx -> HTML converters
    text/                  # small formatting helpers
supabase/
  schema.sql               # tables + seed + storage bucket
  migrations/              # same schema as a CLI migration
```

### Code conventions
Named exports only (except Next.js `page`/`layout`, which require defaults);
one export per file in kebab-case matching the export name; barrel `index.ts`
files per module; single quotes + semicolons via Biome.

---

## A note on AI usage

This project was built with AI assistance (Claude Code). I used it to scaffold,
write boilerplate, and move quickly — but the judgment calls are mine and
documented: the access-control design, the simulated-auth/secret-key tradeoff,
choosing autosave, scoping out real-time collaboration, and adapting to packaging
quirks (e.g., Tiptap 3's StarterKit not shipping command type augmentations,
handled with a targeted declaration in `src/types/tiptap-commands.d.ts`). AI
accelerated the *how*; the *what* and *why* are deliberate.

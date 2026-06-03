# Submission — Noto (AI-Native Full Stack Assessment)

A lightweight collaborative document editor inspired by Google Docs.

## Links

- **Live product:** https://noto-apps.vercel.app
- **Source code:** https://github.com/jayaregalinada/noto
- **Walkthrough video:** see [`WALKTHROUGH-VIDEO.txt`](WALKTHROUGH-VIDEO.txt)

## What's included

| Item | Where |
|---|---|
| Source code | this repository |
| README with local setup + run instructions | [`README.md`](README.md) |
| Architecture note | [`ARCHITECTURE.md`](ARCHITECTURE.md) |
| AI workflow note | [`AI-WORKFLOW.md`](AI-WORKFLOW.md) |
| This submission index | `SUBMISSION.md` |
| Live product URL | https://noto-apps.vercel.app |
| Walkthrough video URL | [`WALKTHROUGH-VIDEO.txt`](WALKTHROUGH-VIDEO.txt) |
| Screenshots | [`docs/screenshots/`](docs/screenshots/) |
| Database schema + seed | [`supabase/schema.sql`](supabase/schema.sql) |

## How to review sharing (seeded accounts)

Simulated auth — no passwords. On the login screen, pick an account:

| Name | Email |
|---|---|
| Ada Lovelace | `ada@noto.test` |
| Alan Turing | `alan@noto.test` |
| Grace Hopper | `grace@noto.test` |
| Katherine Johnson | `katherine@noto.test` |

**Suggested 60-second tour:**
1. Log in as **Ada** → open **"Welcome to Noto"** (she owns it) → edit text, try the
   toolbar; note the autosave indicator. Click **Share** to see/grant access.
2. Log out, log in as **Alan** (editor) → the doc appears under **Shared with you**;
   he can edit.
3. Log out, log in as **Grace** (viewer) → same doc is **read-only** (no toolbar,
   "view only" banner).
4. As any user, **Import file** a `.md`/`.txt`/`.docx` → it becomes a new editable
   document with formatting preserved.

## Running locally

Full instructions in [`README.md`](README.md). Quickstart:
```bash
pnpm install
cp .env.example .env.local      # add Supabase URL + publishable/secret keys + SESSION_SECRET
# apply supabase/schema.sql in the Supabase SQL editor (or `supabase db push`)
pnpm dev                        # http://localhost:3000
pnpm test                       # run the test suite
```
No paid dependencies or services are required (Supabase + Vercel free tiers).

## Status

### Working
- Create / rename / edit / save / reopen documents (rich text: bold, italic,
  underline, H1/H2/normal, bulleted & numbered lists).
- Autosave with status indicator; content + formatting persist across refresh.
- File import: `.txt`, `.md`/`.markdown`, `.docx` → new editable document; original
  file stored in Supabase Storage. Type/size (5 MB) validated and stated in the UI.
- Sharing: owner model, grant **viewer**/**editor** by email, revoke, owned-vs-shared
  dashboard, read-only enforcement for viewers — enforced both in the API and UI.
- Persistence in Supabase Postgres + Storage.
- Deployed to Vercel; validation (zod) + error handling (toasts); 20 automated tests.

### Incomplete / intentionally out of scope
- **Real-time multi-cursor collaboration** (Yjs/CRDT) — not implemented.
- **Postgres RLS policies** — authorization is enforced in application code
  (see [`ARCHITECTURE.md`](ARCHITECTURE.md), tradeoff #2).
- **Document version history** — not implemented.
- **High-fidelity `.docx`** — common formatting imports cleanly; complex layouts
  degrade to clean HTML.
- **Real authentication** — simulated seeded-user login by design.

### What I'd build next with another 2–4 hours
1. **Real-time collaboration** via Yjs + a Tiptap collaboration extension over a
   WebSocket/Supabase Realtime channel (the schema/sharing model already supports it).
2. **RLS policies** behind real Supabase Auth, moving authorization into the database.
3. **Per-keystroke conflict-free autosave + presence avatars** for shared docs.
4. **Document history / restore** using periodic content snapshots.

## Constraints honored
Intentionally scoped (not a full Google Docs clone); depth in a few areas (editor,
sharing, access control) over shallow breadth; no paid dependencies; scope cuts are
stated explicitly above and in the architecture note.

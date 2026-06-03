# Walkthrough Script — Noto

Target length **~2.5–3 minutes**. Record at https://noto-apps.vercel.app with two
browser windows (or one normal + one incognito) so you can show two users at once
without re-logging-in on camera.

**Before you hit record:**
- Open https://noto-apps.vercel.app in Window A (will log in as Ada) and Window B /
  incognito (will log in as Grace).
- Make sure the Supabase project isn't paused (open the app once to wake it).
- Have the import file ready (any `.md`/`.docx`, e.g. the `meeting-notes.md` you used).

Legend: **[DO]** = what to click/show · **SAY** = what to say (paraphrase freely).

---

### 0:00 — Intro (~15s)
**[DO]** Show the login screen.
**SAY:** "Hi, I'm Jay. This is **Noto** — a lightweight collaborative document editor
inspired by Google Docs, built for the Ajaia AI-Native assessment. It's a Next.js app
on Vercel with Supabase for data and storage. Let me walk through it."

### 0:15 — Framing / product judgment (~20s)
**SAY:** "My goal wasn't to clone all of Google Docs — it was to ship one coherent,
fully working slice and be explicit about tradeoffs. So I went deep on three things:
the editing experience, sharing with real access control, and persistence."

### 0:35 — Log in + editor + formatting (~40s)
**[DO]** Click **Ada Lovelace**. On the dashboard, point at "Owned by you" vs
"Shared with you". Open **"Welcome to Noto."**
**SAY:** "Auth is simulated seeded accounts — no passwords — which keeps the focus on
documents and sharing. Here's Ada's dashboard: documents she owns versus shared with
her."
**[DO]** In the editor, select some text → click **Bold**, **Italic**, **Underline**;
toggle a **Heading**; make a **bulleted** and a **numbered list**.
**SAY:** "The editor's built on Tiptap — bold, italic, underline, headings, lists."
**[DO]** Type a few characters; point at the **save indicator** ("Saving… / All
changes saved"). Edit the **title** inline.
**SAY:** "Everything autosaves — debounced — and you can rename inline. I'll refresh
later to show it persists."

### 1:15 — Sharing (~30s)
**[DO]** Click **Share**. Show Ada is Owner, Alan is Editor. Type **grace@noto.test**,
keep **Viewer**, click add.
**SAY:** "Sharing has an owner model. The owner can grant viewer or editor access by
email and revoke it. I'll share this with Grace as a viewer. Access control lives in
one pure function on the server that every route checks — so it can't be bypassed."

### 1:45 — Second user: editor vs read-only viewer (~35s)
**[DO]** Switch to Window B (Grace). Refresh the dashboard → show the doc under
**"Shared with you"** with a **Viewer** badge. Open it.
**SAY:** "Now as Grace — the document shows up under 'Shared with you', and because
she's a viewer it opens **read-only**: no toolbar, a 'view only' banner. Viewers can't
edit, and only owners can share or delete — enforced in the API, not just the UI."
**[DO]** (Optional) Quickly log in as **Alan** somewhere to show an **editor** can edit.

### 2:20 — File import (~20s)
**[DO]** Back as Ada (or any user) on the dashboard → **Import file** → pick a
`.md`/`.docx`.
**SAY:** "You can also import a `.txt`, Markdown, or `.docx` file — it converts to a new
editable document with formatting preserved, and the original file is stored too.
Unsupported types are rejected with a clear message."

### 2:40 — Tradeoffs + what's next + close (~20s)
**[DO]** (Optional) Refresh a doc to show persistence.
**SAY:** "Deliberate cuts: no real-time multi-cursor collab and I enforce
authorization in app code rather than Postgres RLS — both are documented, and the data
model already supports adding them. With another few hours I'd add real-time
collaboration with Yjs and move auth to Supabase Auth with RLS. AI tools helped me move
fast, but the design calls and the verification were mine. Thanks for watching."

---

## Delivery tips
- Keep the cursor moving with your words; pause ~1s after each click so it's followable.
- If you fluff a line, pause and repeat the sentence — trivial to trim, or just leave it.
- Don't read verbatim; these are prompts. Energy and clarity beat perfection.
- If you go long, drop the optional Alan step and the persistence refresh.

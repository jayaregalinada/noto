# Walkthrough Script — Noto

Target length **~2.5–3 minutes** at https://noto-apps.vercel.app.

Each beat below has two columns: **DO** (what to click / show) and **SAY** (the words
to speak). Read down the SAY column; glance at DO for the action.

---

## Before you hit record
- Open **Window A** (normal) → will log in as **Ada**.
- Open **Window B** (incognito) → will log in as **Grace**. Two windows = show two
  users without re-logging-in on camera.
- Open the app once to **wake the Supabase project** (free tier pauses).
- Have an import file ready (any `.md` / `.docx`, e.g. `meeting-notes.md`).

---

## The script

### 1 · Intro — `0:00` (~15s)
| DO | SAY |
|---|---|
| Show the login screen. | "Hi, I'm Jay. This is **Noto** — a lightweight collaborative document editor inspired by Google Docs, built for the Ajaia AI-Native assessment. It's a Next.js app on Vercel with Supabase for data and storage." |

### 2 · Framing / product judgment — `0:15` (~20s)
| DO | SAY |
|---|---|
| Stay on the login screen. | "My goal wasn't to clone all of Google Docs — it was to ship one coherent, fully working slice and be explicit about tradeoffs. So I went deep on three things: the editing experience, sharing with real access control, and persistence." |

### 3 · Login + dashboard — `0:35` (~15s)
| DO | SAY |
|---|---|
| Click **Ada Lovelace**.<br>Point at **"Owned by you"** vs **"Shared with you."** | "Auth is simulated seeded accounts — no passwords — which keeps the focus on documents and sharing. Here's Ada's dashboard: what she owns, versus what's shared with her." |

### 4 · Editor + formatting — `0:50` (~30s)
| DO | SAY |
|---|---|
| Open **"Welcome to Noto."**<br>Select text → **Bold**, **Italic**, **Underline**.<br>Toggle a **Heading**.<br>Make a **bulleted** then **numbered** list. | "The editor's built on Tiptap — bold, italic, underline, headings, and bulleted or numbered lists. It feels like a real document, not a textarea." |

### 5 · Autosave + rename — `1:20` (~15s)
| DO | SAY |
|---|---|
| Type a few characters.<br>Point at the **save indicator**.<br>Edit the **title** inline. | "Everything autosaves — debounced — with a live status indicator, and you can rename inline. I'll refresh at the end to show it all persists." |

### 6 · Sharing — `1:35` (~30s)
| DO | SAY |
|---|---|
| Click **Share**.<br>Point at **Ada = Owner**, **Alan = Editor**.<br>Type **grace@noto.test**, keep **Viewer**, add. | "Sharing uses an owner model — the owner grants viewer or editor access by email, and can revoke it. I'll add Grace as a viewer. Access control lives in one pure function on the server that every route checks, so it can't be bypassed." |

### 7 · Viewer = read-only — `2:05` (~25s)
| DO | SAY |
|---|---|
| Switch to **Window B (Grace)**.<br>Refresh → doc under **"Shared with you"** with a **Viewer** badge.<br>Open it. | "Now as Grace — the document appears under 'Shared with you', and because she's a viewer it opens **read-only**: no toolbar, a 'view only' banner. Only editors can change content, only owners can share or delete — and that's enforced in the API, not just hidden in the UI." |

### 8 · File import — `2:30` (~20s)
| DO | SAY |
|---|---|
| Back as **Ada** → **Import file** → pick a `.md` / `.docx`. | "You can also import a text, Markdown, or Word file — it converts to a new editable document with formatting preserved, and the original is stored too. Unsupported types are rejected with a clear message." |

### 9 · Tradeoffs + next + close — `2:50` (~20s)
| DO | SAY |
|---|---|
| (Optional) Refresh a doc to show persistence. | "Two deliberate cuts: no real-time multi-cursor collaboration, and I enforce authorization in app code rather than Postgres RLS — both documented, both already supported by the data model. With a few more hours I'd add real-time collab with Yjs and move to Supabase Auth with RLS. AI tools helped me move fast, but the design and the verification were mine. Thanks for watching." |

---

## Delivery tips
- Keep the cursor moving with your words; pause ~1s after each click so it's followable.
- Don't read verbatim — these are prompts. Energy and clarity beat perfection.
- Fluff a line? Pause and repeat the sentence; trivial to trim.
- Running long? Drop the optional persistence refresh and tighten beats 4–5.

## 60-second short version (if you need it)
Beats **1 → 3 → 4 → 6 → 7 → 8** only: intro, dashboard, formatting, share with Grace,
show Grace's read-only view, import a file. Skip framing, autosave detail, and the
closing tradeoffs.

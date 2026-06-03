# AI Workflow Note — Noto

This assignment is "AI-Native," so here's an honest account of how I used AI tools
to build Noto, and — more importantly — where I kept judgment in my own hands.

## Tools

- **Claude Code** (Anthropic's CLI agent) as the primary pair — scaffolding,
  writing modules, running the test/build/lint loop, and driving a headless browser
  (Playwright) to verify flows end-to-end.
- **Supabase CLI** and **Vercel** for provisioning and deploy.

## How I worked

1. **Design before code.** I started by framing what the assessment actually rewards
   (product judgment, prioritization, clear tradeoffs) and made the pivotal calls
   up front: timebox, simulated auth, Supabase, Tiptap, and an explicit "ship a
   coherent vertical slice, not a shallow clone" stance.
2. **Vertical slices, verified.** Each capability (auth → dashboard → editor →
   sharing → import) was built and then **verified in a real browser** against the
   real database — login, sharing, the read-only viewer experience, file import, and
   autosave-survives-refresh were all confirmed, not assumed.
3. **Tight feedback loop.** `tsc`, Biome, Vitest, and `next build` were run
   continuously; I treated red output as a stop-and-fix signal rather than pushing on.
4. **Incremental commits.** Work landed in small, labelled commits so the history
   reads as a sequence of deliberate steps.

## Where judgment stayed mine (not outsourced)

The AI accelerated the *how*; the *what* and *why* were decisions I made and can
defend:

- **Access control as one pure function.** Choosing to centralize authorization in
  a single testable `resolveRole` (and returning "not found" instead of "forbidden"
  to avoid leaking existence) is a design decision, not a generated default.
- **Simulated auth + secret key, with the tradeoff stated.** I chose to keep auth
  simulated to protect scope, but to still sign the session cookie properly, and I
  documented that I'd move enforcement to RLS with real auth.
- **Scope cuts.** I explicitly cut real-time collaboration, version history, and RLS
  — and said so — rather than spreading effort thin.
- **Reviewing generated code critically.** Examples where I corrected or overrode AI
  output:
  - Caught that `lucide-react@1.17` ships types via the legacy `typings` field with
    no `exports` map (breaks `tsc` under `moduleResolution: bundler`) and switched to
    Tabler — a real packaging bug, not a style preference.
  - Diagnosed that Tiptap 3's StarterKit doesn't ship command type augmentations and
    fixed it with a scoped declaration (`src/types/tiptap-commands.d.ts`) after
    proving the root cause (the `Editor` type from `@tiptap/react` vs `@tiptap/core`).
  - Renamed a `role` component prop to `accessRole` to stop shadowing the reserved
    ARIA attribute (kept the a11y lint rule on instead of disabling it).
  - Restored `cursor: pointer` on buttons (Tailwind v4 dropped the default) via one
    base rule rather than per-component patches.

## What I'd tell a teammate

AI is excellent for velocity and for catching the boring mistakes, but it will
happily build the wrong thing confidently. The leverage is in deciding what to build,
keeping the design coherent, and verifying behavior against reality — which is where
I spent my attention here.

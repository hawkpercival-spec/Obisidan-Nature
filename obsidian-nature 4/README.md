# Obsidian Nature

**Shed The Psycho and Embrace The Psyche**

A patient-facing psychotraumatology / self-analysis companion built on a
nigromancy-codex structure. It guides one person through **The Percivalian Way —
The Seven Pillars**, a year-long Lacanian/Freudian/Jungian self-analysis arc for
the work done between sessions, or while training to become an analyst.

Built with **Expo + React Native + TypeScript** (works in Cursor/VS Code).

> ⚠️ This is a foundation, not a finished app. Every signature system is coded
> and wired; the runtime "analysis" is a template engine (a clean seam for a
> server LLM). Binary assets (fonts, audio, icons) must be added — see
> `assets/README.md`. A build hasn't been run here (no `npm install`), so treat
> this as source to open, install, and iterate on.

---

## Run it

```bash
npm install          # or: pnpm install / yarn
# add the binary assets listed in assets/README.md
npx expo start       # press i for the iOS simulator
```

To ship to the App Store you'll build with EAS (`eas build -p ios`) once you've
set your Apple bundle id, better-auth server URL, and RevenueCat key (below).

**Putting it on GitHub / opening in Xcode:** see **[GITHUB_AND_XCODE.md](./GITHUB_AND_XCODE.md)**
— git setup, `expo prebuild` to generate the Xcode project, signing, and EAS
builds. (`.gitignore`, `.gitattributes`, `eas.json`, and a CI workflow are
included.)

---

## Architecture

```
App.tsx                     root: fonts, purchases, notifications, providers
src/
  theme/                    nigromancy + Frutiger-Aero design tokens, fonts
  components/
    AscorpLoadingScreen     3D-morphic red dagger • "ASCORP" • "LOVES YOU" • 10s
    TransitionProvider      shows the loader between page transitions
    SoundscapeProvider      ambient bed, auto-starts on login, loops always
    Sigil                   cyber-sigilism glyphs + module seals
    ui / Questionnaire / ReportView / LockedScreen   shared UI
  auth/                     better-auth client + Sign in with Apple
  services/
    iap.ts                  $5.99 non-consumable IAP (RevenueCat/StoreKit)
    notifications.ts        Nightly Inventory scheduling (9pm / elder window)
  store/useAppStore.ts      persisted zustand state + all gating selectors
  data/                     pillars, RHETI, cognition, temperament, intake
  analysis/
    endpoint.ts             authed fetch to the backend analysis API
    remote.ts               async wrappers (LLM call + local fallback) ← screens use these
    lacanian.ts / dreams.ts / erikson.ts   offline template engine + fallback
  navigation/               root gate → intake stack → 6 main tabs
  screens/                  auth, onboarding, paywall, intake, pillars, nightly,
                            dreams, archetypal, rituals, progress
server/                     reference backend: Express + better-auth + Claude
  server.ts / auth.ts / analysis.route.ts / prompts.ts
```

### Flow / gating (in `RootNavigator` + store selectors)

1. **Sign in with Apple** → soundscape starts, paywall waits until after login.
2. **Birth year only** (never full DOB). Age bands:
   - `< 67` → Nightly Inventory at **9:00pm** local (every timezone).
   - `67–100` → choose a time in the **7:00–8:30pm** window.
   - `70–100` → **elder track** (end-of-life integration content) and **no paywall**.
3. **Intake** — a structured **Freudian + Lacanian self-analysis module** (free
   first portion), walked one section at a time: a free-association opener, the
   five Freudian domains (presenting concerns, affect, history/origins, inner
   conflict & defenses, relationships/transference), then the Lacanian
   fundamental questions (origins, death/aliveness, meaning, body, desire, the
   Good) and the pivotal self-as-symptom question. See `data/intake.ts`.
   Then the **$5.99/month subscription paywall** (under-70 only) → Enneagram
   (RHETI) → Jungian cognition → medieval temperament → Jungian archetypal
   material → generated **Freudian & Lacanian analysis report + curriculum outline**.
4. **Main tabs**: Codex · Nightly · Dreams · Archetypes · Rituals · Progress.

### Feature → file map (every request in the brief)

| Requirement | Where |
|---|---|
| ASCORP dagger loading screen, 10s, "LOVES YOU" under quote, medieval font | `components/AscorpLoadingScreen.tsx` |
| Loader between every page transition | `components/TransitionProvider.tsx` (`transition(...)`) |
| Cyber-sigilism + module-complete seals | `components/Sigil.tsx`, pillar screens |
| Ambient cyber-goth soundscape, auto-on at login, always looping | `components/SoundscapeProvider.tsx` |
| Apple OAuth via better-auth (email + profile scopes) | `auth/auth.ts` (`socialProviders.apple` on server) |
| $5.99/month subscription, under-70 only, free for 70+ | `services/iap.ts`, `screens/paywall/PaywallGate.tsx`, `store` `isPaywalled` |
| Birth-year-only capture + age flagging | `screens/onboarding/BirthYearScreen.tsx` |
| Freudian + Lacanian intake module (sectioned, free-association) + "working with an analyst?" tone switch | `data/intake.ts`, `screens/intake/IntakeFreeScreen.tsx`, `analysis/lacanian.ts` |
| RHETI enneagram / Jungian cognition / medieval temperament | `data/*`, `screens/intake/*` |
| Jungian archetypal-material intake → Archetypal Explorations | `screens/intake/JungianScreen.tsx`, `screens/archetypal/ArchetypalScreen.tsx` |
| Intake Lacanian report + personalised curriculum | `analysis/lacanian.ts`, `screens/intake/IntakeReportScreen.tsx` |
| Seven Pillars, 365-day arc, per-pillar case formulation + grading | `data/pillars.ts`, `analysis/lacanian.ts`, `screens/pillars/*` |
| Weekly (Friday) homework, graded into progress | `analysis/lacanian.ts` `generateHomework`/`gradeHomework` |
| Nightly Inventory (Freudian/Lacanian), fresh nightly, 9pm | `screens/nightly/*`, `services/notifications.ts` |
| Dream Journal (Jungian exposition/development/lysis) | `screens/dreams/*`, `analysis/dreams.ts` |
| Daily Ritual — unlocks only after all pillars, "Codex Sealed" gate | `screens/rituals/DailyRitualScreen.tsx` |
| Progress Report tab | `screens/progress/ProgressScreen.tsx` |
| Elder track: Erikson late stages + integrating younger loved ones | `analysis/erikson.ts`, `analysis/lacanian.ts`, Progress screen |
| Grounded, reality-based content (no spiritual-psychosis framing) | see note below |

---

## Configuration you must supply

- **`app.json` → `ios.bundleIdentifier`**: your real bundle id.
- **`app.json` → `extra.authBaseUrl`**: URL of your better-auth server. The Apple
  provider (`socialProviders.apple`) is configured server-side — see the block in
  `src/auth/auth.ts`. You'll need an Apple Services ID + key.
- **`app.json` → `extra.revenueCatApiKeyIos`**: RevenueCat public SDK key.
  Create an **Auto-Renewable Subscription** `org.asphodelpress.obsidiannature.monthly`
  (1-month duration, **$5.99/month**, subscription group "Obsidian Nature Access")
  in App Store Connect and map it to a `full_access` entitlement.

## App Store compatibility notes

- Uses a **StoreKit auto-renewable subscription** for the $5.99/month unlock (not
  external payment) — Apple requires this for digital content.
- The paywall shows the required **auto-renewal disclosure** (price, cadence, and
  that it renews until cancelled) plus links to manage/cancel — an App Review
  requirement for subscriptions.
- **Restore Subscription** is implemented (App Review requirement).
- **Sign in with Apple** is enabled (`usesAppleSignIn`).
- Background **audio** mode is declared for the always-on soundscape.
- Notifications permission string is set for the Nightly Inventory.

## Grounding / safety

The occult *aesthetic* is skin-deep. All analysis prose and exercises are
**psychological and metaphorical** — no supernatural claims, no mysticism
presented as literal reality. "Obsidian nature" is a metaphor for the shadow
(disowned aspects of personality, cognition, and behaviour). The app repeatedly
frames itself as a reflection tool used **alongside**, not instead of,
professional care, and the login screen states this explicitly.

## The analysis layer (LLM-wired, with offline fallback)

Screens call **async** wrappers in `analysis/remote.ts`. Each wrapper POSTs to
your backend (`analysis/endpoint.ts`, authenticated with the better-auth session
cookie) and, on **any** failure — endpoint unset, offline, timeout, non-2xx —
falls back to the deterministic generators in `analysis/lacanian.ts` /
`analysis/dreams.ts`. So the app always returns a result: richer Claude-written
prose when the server is reachable, solid template output when it isn't.

```
app  →  analysis/remote.ts  →  analysis/endpoint.ts  →  YOUR server (server/)  →  Claude
                └── on failure ──►  analysis/lacanian.ts / dreams.ts  (local fallback)
```

**Security:** the LLM key lives only on the server, never in the app bundle. The
reference backend is in `server/` (Express + better-auth session check + Claude,
strict-JSON prompts in `server/prompts.ts`). See `server/README.md` to run it.

`analysisConfigured()` treats `localhost` / `example.com` / `YOUR_...` URLs as
"not configured", so with the default `app.json` the app runs fully on the local
fallback. Set a real `extra.analysisBaseUrl` to go live — no screen changes.

Still local (easy to move to the endpoint later): `personaliseExercises` and the
weekly `generateHomework` prompt scaffold.
```

## Design decision worth flagging

The brief had two readings of *when* the paywall appears. This build places it
**inside the intake flow** — the opening inventory is free, and the paywall gates
the paid assessment sections and everything after — which satisfies both "the
first portion of intake is free" and "under-70 must pay to unlock the rest."
Move `PaywallGate` up to the root navigator if you prefer charging immediately
after login.

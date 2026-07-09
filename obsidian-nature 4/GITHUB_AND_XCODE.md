# Getting Obsidian Nature onto GitHub and into Xcode

This is an Expo + React Native (TypeScript) app. You don't hand-write the Xcode
project — you **generate** it from this code with `expo prebuild`, then open the
resulting `.xcworkspace` in Xcode. The intake module (and everything else) is
already in this repo under `src/`; nothing extra is needed to "make it work in
Xcode" beyond the steps below.

Prerequisites (macOS): Node 20 (`.nvmrc`), Xcode + Command Line Tools,
CocoaPods (`sudo gem install cocoapods`), and an Apple Developer account for
device builds / Sign in with Apple / in-app purchases.

---

## 1) Put it on GitHub

From inside the `obsidian-nature/` folder:

```bash
git init
git add .
git commit -m "Obsidian Nature: initial commit (app + intake module + server)"

# Create an EMPTY repo on github.com first (no README), then:
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/obsidian-nature.git
git push -u origin main
```

`.gitignore` already excludes `node_modules`, secrets (`.env`, `*.p8`, `*.p12`,
`*.mobileprovision`), and the generated `/ios` + `/android` folders. The GitHub
Actions workflow in `.github/workflows/ci.yml` typechecks every push.

> Tip: if `git@github.com` (SSH) isn't set up, use the HTTPS URL
> `https://github.com/YOUR_USERNAME/obsidian-nature.git` instead.

---

## 2) Install dependencies

```bash
nvm use          # picks Node 20 from .nvmrc (or install Node 20 yourself)
npm install
```

Add the binary assets listed in `assets/README.md` (fonts, audio, icons) — the
app `require()`s them, so the native build fails without them.

---

## 3) Generate the native iOS project (this creates the Xcode project)

```bash
npx expo prebuild -p ios
```

This reads `app.json` (bundle id `org.asphodelpress.obsidiannature`, Sign in with
Apple entitlement, background-audio mode, notification + Apple-sign-in config)
and produces an `ios/` folder containing `ObsidianNature.xcworkspace` and a
`Podfile`. It also runs `pod install`. Re-run it any time you change native
config in `app.json` or add a plugin.

> `/ios` is gitignored on purpose — it's generated. If you ever need to edit
> native code by hand, remove `/ios` and `/android` from `.gitignore` and commit
> them.

---

## 4) Open in Xcode

```bash
open ios/ObsidianNature.xcworkspace
```

Open the **`.xcworkspace`**, not the `.xcodeproj` (Pods live in the workspace).

In Xcode:

1. Select the **ObsidianNature** target → **Signing & Capabilities**.
2. Set your **Team** and let Xcode manage signing. The bundle id is already
   `org.asphodelpress.obsidiannature`.
3. Confirm these capabilities are present (Expo adds them from `app.json`):
   - **Sign in with Apple**
   - **In-App Purchase**
   - **Background Modes → Audio** (for the always-on soundscape)
   - **Push/Local Notifications** entitlement (for the Nightly Inventory)
4. Pick a simulator or a connected device and press **⌘R**.

For JS to load during development, keep Metro running in a second terminal:

```bash
npx expo start
```

(Or just `npx expo run:ios`, which builds via Xcode toolchain and starts Metro
for you.)

---

## 5) Configure the two external services before a real build

- **better-auth server + analysis endpoint** — set `extra.authBaseUrl` and
  `extra.analysisBaseUrl` in `app.json` to your deployed server URL (see
  `server/README.md`). Apple sign-in's `socialProviders.apple` is configured on
  the server. Until these point at a real host, the app runs on its local
  analysis fallback and Apple login won't complete.
- **RevenueCat (IAP)** — set `extra.revenueCatApiKeyIos`, and create the
  `org.asphodelpress.obsidiannature.monthly` auto-renewable subscription
  ($5.99/mo) in App Store Connect. See the main `README.md`.

---

## 6) App Store builds (recommended: EAS)

Local Xcode Archive works, but EAS handles signing headaches for you:

```bash
npm install -g eas-cli
eas login
eas build -p ios --profile production      # cloud build -> .ipa
eas submit -p ios --profile production      # upload to App Store Connect
```

`eas.json` has `development` / `preview` (simulator-enabled) / `production`
profiles. Fill in `ascAppId` and `appleTeamId` under `submit.production.ios`
before `eas submit`.

---

## Common gotchas

- **"No bundle URL present"** in the simulator → Metro isn't running; run
  `npx expo start` (or use `npx expo run:ios`).
- **Pod install fails** → `cd ios && pod repo update && pod install`.
- **Sign in with Apple does nothing** → the entitlement is set, but you also need
  the Services ID + key configured on the better-auth server and `authBaseUrl`
  pointing at it.
- **Changed `app.json`?** → re-run `npx expo prebuild -p ios --clean`.
- **Fonts/audio missing at build** → add the files from `assets/README.md`.

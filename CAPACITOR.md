# SleepFlow — Capacitor (Android / iOS) packaging guide

This project is a **TanStack Start SSR web app**. To distribute it as a
real native Android APK / AAB we wrap it with **Capacitor**. The native
shell loads the published web app inside an Android WebView and uses the
existing Service Worker (`public/audio-sw.js`) for offline audio caching.

Everything below is run **locally on your own machine** (or CI). The
Lovable sandbox cannot produce APKs — it has no Android SDK / JDK /
Gradle / signing keys.

---

## 1. One-time machine setup

Install on your local dev machine:

- **Node.js 20+** and **npm** (or bun / pnpm)
- **JDK 17** (Temurin recommended)
- **Android Studio** (latest stable) with:
  - Android SDK Platform 34
  - Android SDK Build-Tools 34
  - Android Emulator (optional, for testing)
- Set environment variables:
  ```
  export ANDROID_HOME=$HOME/Library/Android/sdk    # macOS example
  export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin
  ```

---

## 2. Pull the project to your machine

1. In Lovable, click **GitHub → Connect** and push the repo.
2. Clone it locally:
   ```bash
   git clone <your-repo-url> sleepflow
   cd sleepflow
   npm install
   ```

---

## 3. Add Capacitor

The repo already includes `capacitor.config.ts`. Install the runtime:

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android \
            @capacitor/splash-screen @capacitor/status-bar
```

(Optional, for iOS later: `npm install @capacitor/ios`)

---

## 4. Prepare the `webDir` (`dist-capacitor/`)

Capacitor needs a static folder to bundle. Because we load the live app
from `server.url`, this folder only needs a tiny **offline fallback
shell**. Create it once:

```bash
mkdir -p dist-capacitor
cat > dist-capacitor/index.html <<'HTML'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
    <title>SleepFlow</title>
    <style>
      html,body{margin:0;height:100%;background:#0b0b14;color:#e7e7f0;
        font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
        display:flex;align-items:center;justify-content:center;text-align:center;padding:24px;}
      .dot{width:10px;height:10px;border-radius:50%;background:#9b8cff;
        display:inline-block;animation:p 1s infinite alternate;margin:0 3px;}
      .dot:nth-child(2){animation-delay:.2s}.dot:nth-child(3){animation-delay:.4s}
      @keyframes p{to{opacity:.3;transform:translateY(-4px)}}
    </style>
  </head>
  <body>
    <div>
      <h1 style="font-weight:600;font-size:20px;margin:0 0 8px">SleepFlow</h1>
      <p style="opacity:.7;margin:0 0 16px">Loading…</p>
      <span class="dot"></span><span class="dot"></span><span class="dot"></span>
    </div>
  </body>
</html>
HTML
```

Capacitor will copy this into the APK as the fallback the WebView shows
before `server.url` finishes loading (or if the device is fully offline
on first launch).

---

## 5. Add the Android platform

```bash
npx cap add android
npx cap sync android
```

This creates the `android/` folder (a real Gradle/Android Studio
project) with `AndroidManifest.xml`, DEX targets, resources, and the
embedded `dist-capacitor/` assets.

---

## 6. Required Android tweaks

Open `android/app/src/main/AndroidManifest.xml` and confirm:

- `<uses-permission android:name="android.permission.INTERNET" />` is present
- The `<application>` tag has `android:usesCleartextTraffic="false"`
- The main activity uses `android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"` (Capacitor sets this by default)

For smooth audio in the background, add to `<application>`:
```xml
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
```

---

## 7. Build a debug APK (sanity check)

```bash
npx cap sync android
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk` (≈ 5–8 MB).
Install on a connected device:
```bash
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

---

## 8. Build a signed release APK + AAB (Play Store)

### 8a. Create a keystore (once)

```bash
keytool -genkey -v -keystore sleepflow-release.keystore \
  -alias sleepflow -keyalg RSA -keysize 2048 -validity 10000
```

Store the keystore + passwords in a safe place (1Password, etc.).
**Losing it means you can never publish updates to the same Play listing.**

### 8b. Wire it into Gradle

Create `android/keystore.properties`:
```
storeFile=../sleepflow-release.keystore
storePassword=YOUR_STORE_PASSWORD
keyAlias=sleepflow
keyPassword=YOUR_KEY_PASSWORD
```

Edit `android/app/build.gradle` — inside `android { ... }` add:
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled true
        shrinkResources true
    }
}
```

Add `android/keystore.properties` and `*.keystore` to `.gitignore`.

### 8c. Build

```bash
cd android
./gradlew assembleRelease        # APK  → app/build/outputs/apk/release/app-release.apk
./gradlew bundleRelease          # AAB  → app/build/outputs/bundle/release/app-release.aab
```

Expected sizes: APK ≈ 6–10 MB, AAB ≈ 4–7 MB.

Install the signed APK directly:
```bash
adb install -r app/build/outputs/apk/release/app-release.apk
```

For Play Store upload, use the AAB.

---

## 9. WebView / performance notes (already handled in code)

These are already correct in the repo — listing for confirmation:

| Concern | Where it's handled |
|---|---|
| Touch responsiveness | All buttons use semantic `<button>` (no fake `<div onClick>`) |
| Input focus on Android | shadcn `<input>` / `<textarea>` — no custom keyboard intercept |
| Audio playback in WebView | Single `<audio>` element in `src/lib/player-store.ts` with `playsInline` + `crossOrigin="anonymous"` |
| Audio caching offline | `public/audio-sw.js` caches `supabase.co/storage/...` audio after first play |
| Autoplay on user gesture | `engine.play()` called synchronously inside the tap handler in `TrackRow.tsx` |
| Re-render storms during playback | `usePlayerSelector` in `player-store.ts` keeps high-frequency `timeupdate` events off the render path |
| Viewport / safe areas | `<meta name="viewport" content="width=device-width, initial-scale=1">` in `__root.tsx` |

No code changes are needed in `src/` to support Capacitor — the web app
runs as-is inside the WebView.

---

## 10. Updating the app after a Lovable change

Whenever you publish a new web version on Lovable:

1. **No native rebuild needed** if you only changed JS/CSS/routes. The
   APK fetches the latest from `server.url` on next launch.
2. **Native rebuild required** only when you change `capacitor.config.ts`,
   add a Capacitor plugin, change the app icon / splash, bump
   `versionCode`, or change Android permissions:
   ```bash
   npx cap sync android
   cd android && ./gradlew bundleRelease
   ```

---

## 11. Troubleshooting

| Symptom | Fix |
|---|---|
| "App not installed" / "package invalid" | You're sideloading an unsigned or wrong-arch APK. Use the signed release APK from step 8. |
| White screen on launch, no network | Device is offline AND has never loaded the app. `dist-capacitor/index.html` is the only thing available — expected behavior. Connect to Wi-Fi once. |
| Audio doesn't play | Tap a track directly (autoplay requires user gesture). Check that `https://ubrbvkaspsphdxpsvazq.supabase.co` is reachable. |
| "Mixed content" errors | Ensure `cleartext: false` in `capacitor.config.ts` and that `server.url` is `https://`. |
| Chat input frozen | Verify `webContentsDebuggingEnabled: true`, attach Chrome DevTools (`chrome://inspect`) to see the real console error. |

---

## Summary

- `capacitor.config.ts` — committed to repo ✅
- `dist-capacitor/index.html` — generated locally (step 4)
- `android/` — generated locally (`npx cap add android`)
- APK / AAB output — generated locally (`./gradlew assembleRelease` / `bundleRelease`)
- Lovable cannot produce the APK; this guide is the handoff to your local Android Studio build.

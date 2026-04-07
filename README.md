# AuralMood MVP

AuralMood is a wellness soundscape app built with React, Chakra UI, Tone.js, and Firebase.

## What’s included

- Mood-based ambient sound layers
- Smooth fade-in / fade-out audio handling
- Anonymous Firebase auth + Firestore analytics
- Simple mood selector UI with emoji buttons
- PWA-ready service worker and manifest
- Component-based React architecture with clean audio lifecycle

## Local setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file in the project root with your Firebase values:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

3. Run development server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

## Notes

- Audio is generated with Tone.js and managed through a centralized `SoundEngine`.
- Mood configuration is driven by `src/audio/moods.json`.
- The service worker is registered in `src/main.jsx` and caches UI assets for offline loading.
- Firebase logs are best-effort and will not block the app when configuration is missing.

## Folder structure

- `src/components/` — UI screens and mood controls
- `src/audio/` — mood data and the sound engine
- `src/hooks/` — global audio hook
- `public/manifest.json` — PWA metadata
- `public/service-worker.js` — static caching support

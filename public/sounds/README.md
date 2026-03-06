# Ambient sound files

Add looping ambient MP3s here for each mood. Names must match `src/audio/moods.json`:

- `ocean.mp3` — Calm
- `wind.mp3` — Anxious
- `noise.mp3` — Focused (e.g. brown/white noise)
- `waves.mp3` — Sleepy
- `forest.mp3` — Energized

Use seamless loops (same start/end) for best results. You can host these in Firebase Storage and set `soundUrl` in `moods.json` to the download URL.

import * as Tone from 'tone';

function fadeParam(param, target, duration) {
  if (!param) return;
  if (typeof param.rampTo === 'function') {
    param.rampTo(target, duration);
  } else if (typeof param.setValueAtTime === 'function') {
    const now = Tone.now();
    param.setValueAtTime(param.value, now);
    param.linearRampToValueAtTime(target, now + duration);
  }
}

function safelyDispose(node) {
  if (!node) return;
  if (typeof node.stop === 'function') {
    try {
      node.stop();
    } catch (err) {
      // ignore stop errors when node is already stopped
    }
  }
  if (typeof node.dispose === 'function') {
    node.dispose();
  }
}

export default class SoundEngine {
  constructor(moodData) {
    this.moods = moodData;
    this.currentMood = null;
    this.activeAmbient = null;
    this.activeTone = null;
    this.activeLFOs = [];
    this.isPlaying = false;
    this.isInitialized = false;
    this.masterVolume = null;
    this.masterVolumeValue = 0; // in dB
  }

  async init() {
    if (this.isInitialized) return;

    // Initialize Tone.js context and create a test sound to buffer
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }

    // Create master volume node if not already created
    if (!this.masterVolume) {
      this.masterVolume = new Tone.Volume(this.masterVolumeValue).toDestination();
    }

    // Create and immediately dispose a test sound to warm up the audio engine
    const testNoise = new Tone.Noise('pink').start();
    const testFilter = new Tone.Filter(800, 'lowpass');
    const testVolume = new Tone.Volume(-80);

    testNoise.connect(testFilter);
    testFilter.connect(testVolume);
    testVolume.toDestination();

    // Brief test playback to initialize audio pipeline
    testVolume.volume.rampTo(-60, 0.1);
    await new Promise(resolve => setTimeout(resolve, 100));
    testVolume.volume.rampTo(-80, 0.1);
    await new Promise(resolve => setTimeout(resolve, 100));

    // Clean up test sound
    testNoise.stop();
    testNoise.dispose();
    testFilter.dispose();
    testVolume.dispose();

    this.isInitialized = true;
  }

  buildAmbient(config) {
    const source = new Tone.Noise(config.ambient.noiseType || 'pink').start();
    const filter = new Tone.Filter({
      type: config.ambient.filterType || 'lowpass',
      frequency: config.ambient.filterFrequency || 800,
      rolloff: -12,
    });
    const volume = new Tone.Volume(-80);

    source.connect(filter);
    filter.connect(volume);
    if (this.masterVolume) {
      volume.connect(this.masterVolume);
    } else {
      volume.toDestination();
    }

    const activeLFOs = [];
    if (config.ambient.lfo) {
      const lfo = new Tone.LFO(
        config.ambient.lfo.rate,
        config.ambient.lfo.min,
        config.ambient.lfo.max
      ).start();
      if (config.ambient.lfo.target === 'filterFrequency') {
        lfo.connect(filter.frequency);
      } else if (config.ambient.lfo.target === 'volume') {
        lfo.connect(volume.volume);
      }
      activeLFOs.push(lfo);
    }

    return { source, filter, volume, activeLFOs };
  }

  buildTone(config) {
    if (!config.tone) {
      return null;
    }

    const oscillator = new Tone.Oscillator({
      type: config.tone.type || 'sine',
      frequency: config.tone.frequency || 440,
    }).start();
    const volume = new Tone.Volume(-80);

    oscillator.connect(volume);
    if (this.masterVolume) {
      volume.connect(this.masterVolume);
    } else {
      volume.toDestination();
    }

    const activeLFOs = [];
    if (config.tone.lfo) {
      const lfo = new Tone.LFO(
        config.tone.lfo.rate,
        config.tone.lfo.min,
        config.tone.lfo.max
      ).start();
      if (config.tone.lfo.target === 'frequency') {
        lfo.connect(oscillator.frequency);
      } else if (config.tone.lfo.target === 'volume') {
        lfo.connect(volume.volume);
      }
      activeLFOs.push(lfo);
    }

    return { oscillator, volume, activeLFOs };
  }

  async playMood(moodKey) {
    if (!this.moods[moodKey]) {
      throw new Error(`Mood "${moodKey}" does not exist in the sound map.`);
    }

    await this.init();

    if (this.isPlaying && this.currentMood === moodKey) {
      return;
    }

    if (this.isPlaying) {
      await this.stop();
    }

    const mood = this.moods[moodKey];
    const ambient = this.buildAmbient(mood);
    const tone = this.buildTone(mood);

    this.activeAmbient = ambient;
    this.activeTone = tone;
    this.activeLFOs = [...ambient.activeLFOs, ...(tone?.activeLFOs || [])];
    this.currentMood = moodKey;
    this.isPlaying = true;

    const ambientTarget = mood.ambient.volume ?? -18;
    fadeParam(ambient.volume.volume, ambientTarget, mood.ambient.fadeIn || 4);

    if (tone) {
      const toneTarget = mood.tone.volume ?? -28;
      fadeParam(tone.volume.volume, toneTarget, (mood.ambient.fadeIn || 4) * 0.6);
    }
  }

  async stop() {
    if (!this.activeAmbient) {
      return;
    }

    const fadeOut = this.moods[this.currentMood]?.ambient?.fadeOut || 3;
    fadeParam(this.activeAmbient.volume.volume, -80, fadeOut);
    if (this.activeTone) {
      fadeParam(this.activeTone.volume.volume, -80, fadeOut);
    }

    await new Promise((resolve) => {
      setTimeout(resolve, (fadeOut + 0.1) * 1000);
    });

    this.disposeCurrent();
    this.currentMood = null;
    this.isPlaying = false;
  }

  disposeCurrent() {
    if (this.activeAmbient) {
      safelyDispose(this.activeAmbient.source);
      safelyDispose(this.activeAmbient.filter);
      safelyDispose(this.activeAmbient.volume);
      this.activeAmbient.activeLFOs?.forEach(safelyDispose);
    }
    if (this.activeTone) {
      safelyDispose(this.activeTone.oscillator);
      safelyDispose(this.activeTone.volume);
      this.activeTone.activeLFOs?.forEach(safelyDispose);
    }
    this.activeAmbient = null;
    this.activeTone = null;
    this.activeLFOs = [];
  }

  setMasterVolume(volumeDb) {
    this.masterVolumeValue = volumeDb;
    if (this.masterVolume) {
      fadeParam(this.masterVolume.volume, volumeDb, 0.1);
    }
  }

  getMasterVolume() {
    return this.masterVolumeValue;
  }

  async dispose() {
    await this.stop();
    this.disposeCurrent();
    if (this.masterVolume) {
      this.masterVolume.dispose();
      this.masterVolume = null;
    }
  }
}

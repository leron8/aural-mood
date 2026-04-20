import { useEffect, useRef, useState } from 'react';
import SoundEngine from '../audio/SoundEngine.js';

const STORAGE_KEY = 'auralmood:volume';
const DEFAULT_VOLUME = 0; // 0 dB (full volume)

export default function useAudioEngine(moodData) {
  const engineRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [engineReady, setEngineReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(() => {
    const savedVolume = localStorage.getItem(STORAGE_KEY);
    return savedVolume !== null ? parseFloat(savedVolume) : DEFAULT_VOLUME;
  });

  const setVolume = (newVolume) => {
    setVolumeState(newVolume);
    localStorage.setItem(STORAGE_KEY, newVolume.toString());
    if (engineRef.current) {
      engineRef.current.setMasterVolume(newVolume);
    }
  };

  const playMood = async (moodKey) => {
    if (!engineRef.current) {
      setIsLoading(true);
      try {
        engineRef.current = new SoundEngine(moodData);
        engineRef.current.setMasterVolume(volume);
        await engineRef.current.init(); // Initialize and buffer audio
        setEngineReady(true);
      } catch (error) {
        console.warn('Audio engine initialization failed:', error);
        setEngineReady(false);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
    }

    if (!engineRef.current || !engineReady) return;

    try {
      await engineRef.current.playMood(moodKey);
      setCurrentMood(moodKey);
      setIsPlaying(true);
    } catch (error) {
      console.warn('Failed to play mood:', error);
    }
  };

  const stop = async () => {
    if (!engineRef.current) return;

    try {
      await engineRef.current.stop();
      setIsPlaying(false);
    } catch (error) {
      console.warn('Failed to stop audio:', error);
    }
  };

  return {
    engineReady,
    isLoading,
    currentMood,
    isPlaying,
    volume,
    setVolume,
    playMood,
    stop,
  };
}

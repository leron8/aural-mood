import { useEffect, useRef, useState } from 'react';
import SoundEngine from '../audio/SoundEngine.js';

export default function useAudioEngine(moodData) {
  const engineRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [engineReady, setEngineReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initEngine = async () => {
      try {
        engineRef.current = new SoundEngine(moodData);
        await engineRef.current.init(); // Initialize and buffer audio
        setEngineReady(true);
      } catch (error) {
        console.warn('Audio engine initialization failed:', error);
        setEngineReady(false);
      } finally {
        setIsLoading(false);
      }
    };

    initEngine();

    return () => {
      engineRef.current?.dispose();
    };
  }, [moodData]);

  const playMood = async (moodKey) => {
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
    playMood,
    stop,
  };
}

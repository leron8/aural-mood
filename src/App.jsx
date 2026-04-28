import { useEffect, useMemo, useState } from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { auth, firestore } from './firebase.js';
import { signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import useAudioEngine from './hooks/useAudioEngine.js';
import moods from './audio/moods.json';
import MoodSelector from './components/MoodSelector.jsx';
import SoundScene from './components/SoundScene.jsx';
import ParticlesBackground from './components/ParticlesBackground.jsx';

function App() {
  const [selectedMood, setSelectedMood] = useState('calm');
  const [signedIn, setSignedIn] = useState(false);
  const [sessionStart] = useState(() => Date.now());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { engineReady, isLoading, isPlaying, playMood, stop, volume, setVolume } = useAudioEngine(moods);
  const mood = useMemo(() => moods[selectedMood] || moods.calm, [selectedMood]);

  useEffect(() => {
    const lastMood = localStorage.getItem('auralmood:lastMood');
    if (lastMood && moods[lastMood]) {
      setSelectedMood(lastMood);
    }
  }, []);

  // Auto-play mood on mount
  useEffect(() => {
    if (engineReady && selectedMood && !isPlaying) {
      playMood(selectedMood);
    }
  }, [engineReady]);

  useEffect(() => {
    if (!auth) {
      return;
    }

    signInAnonymously(auth).catch((error) => {
      console.warn('Firebase anonymous sign-in failed', error);
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSignedIn(true);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    return () => {
      if (!firestore) {
        return;
      }

      const durationSeconds = Math.max(1, Math.round((Date.now() - sessionStart) / 1000));
      addDoc(collection(firestore, 'sessionDuration'), {
        durationSeconds,
        createdAt: serverTimestamp(),
      }).catch(() => {
        // Firestore logging is best-effort for the MVP.
      });
    };
  }, [sessionStart]);

  const logMoodUsage = async (moodKey) => {
    if (!firestore) {
      return;
    }

    try {
      await addDoc(collection(firestore, 'moodUsage'), {
        mood: moodKey,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.warn('Mood usage analytics failed', error);
    }
  };

  const handleMoodSelect = async (moodKey) => {
    setSelectedMood(moodKey);
    localStorage.setItem('auralmood:lastMood', moodKey);
    await playMood(moodKey);
    logMoodUsage(moodKey);
  };

  const handleToggle = async () => {
    setIsTransitioning(true);
    try {
      if (isPlaying) {
        await stop();
      } else {
        await playMood(selectedMood);
        logMoodUsage(selectedMood);
      }
    } finally {
      setIsTransitioning(false);
    }
  };

  const backgroundImage = `${mood.bgImage}, url('/ocean.jpg')`;

  return (
    <Box
      minH="100vh"
      position="relative"
      overflow="hidden"
      bgImage={backgroundImage}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      backgroundBlendMode="overlay"
      transition="background 0.8s ease"
      color="white"
    >
      {/*<ParticlesBackground particleColor={mood.particleColor} />*/}
      <Container maxW="6xl" py={{ base: 10, md: 14 }} position="relative" zIndex={2}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} align="center" textAlign="center" color="white">
            <Heading size="2xl">AuralMood</Heading>
            <MoodSelector moods={moods} selectedMood={selectedMood} onSelect={handleMoodSelect} />
          </VStack>
          <SoundScene mood={mood} isPlaying={isPlaying} onToggle={handleToggle} engineReady={!isLoading} volume={volume} onVolumeChange={setVolume} isTransitioning={isTransitioning} />
        </VStack>
      </Container>
    </Box>
  );
}

export default App;

import { Box } from '@chakra-ui/react';

const particleData = [
  { size: '260px', top: '10%', left: '8%', opacity: 0.16, duration: '32s' },
  { size: '180px', top: '18%', left: '82%', opacity: 0.12, duration: '24s' },
  { size: '320px', top: '68%', left: '14%', opacity: 0.1, duration: '34s' },
  { size: '220px', top: '60%', left: '70%', opacity: 0.13, duration: '26s' },
  { size: '140px', top: '42%', left: '46%', opacity: 0.09, duration: '28s' }
];

const smallGlowData = [
  { size: '14px', top: '22%', left: '28%', opacity: 0.45, duration: '16s' },
  { size: '12px', top: '35%', left: '77%', opacity: 0.4, duration: '14s' },
  { size: '18px', top: '55%', left: '52%', opacity: 0.3, duration: '18s' },
  { size: '10px', top: '78%', left: '33%', opacity: 0.35, duration: '20s' },
  { size: '16px', top: '12%', left: '62%', opacity: 0.38, duration: '22s' }
];

export default function ParticlesBackground({ particleColor = '#ffffff' }) {
  return (
    <Box
      pointerEvents="none"
      position="absolute"
      inset={0}
      overflow="hidden"
      zIndex={0}
      transition="all 0.8s ease"
    >
      <Box
        position="absolute"
        inset={0}
        bg={`radial-gradient(circle at 20% 20%, ${adjustColor(particleColor, 0.16)}, transparent 25%), radial-gradient(circle at 80% 80%, ${adjustColor(particleColor, 0.1)}, transparent 32%)`}
        filter="blur(12px)"
        opacity={0.95}
      />
      {particleData.map((particle, index) => (
        <Box
          key={`glow-${index}`}
          position="absolute"
          top={particle.top}
          left={particle.left}
          width={particle.size}
          height={particle.size}
          bg={`radial-gradient(circle, rgba(${hexToRgb(particleColor)}, 0.18), transparent 58%)`}
          borderRadius="full"
          filter="blur(24px)"
          opacity={particle.opacity}
          animation={`drift ${particle.duration} ease-in-out infinite`}
          transition="background-color 0.8s ease"
        />
      ))}
      {smallGlowData.map((particle, index) => (
        <Box
          key={`dot-${index}`}
          position="absolute"
          top={particle.top}
          left={particle.left}
          width={particle.size}
          height={particle.size}
          bg={`rgba(${hexToRgb(particleColor)}, 0.28)`}
          borderRadius="full"
          filter="blur(2px)"
          opacity={particle.opacity}
          animation={`drift ${particle.duration} ease-in-out infinite`}
          transition="background-color 0.8s ease"
        />
      ))}
    </Box>
  );
}

// Helper function to convert hex to rgb values
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
}

// Helper function to adjust color opacity for gradients
function adjustColor(color, opacity) {
  const rgb = hexToRgb(color);
  return `rgba(${rgb}, ${opacity})`;
}

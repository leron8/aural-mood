import { Box } from '@chakra-ui/react';

const particleData = [
  { size: '260px', top: '10%', left: '8%', opacity: 0.14, duration: '24s' },
  { size: '180px', top: '20%', left: '85%', opacity: 0.12, duration: '18s' },
  { size: '280px', top: '70%', left: '18%', opacity: 0.08, duration: '30s' },
  { size: '220px', top: '65%', left: '72%', opacity: 0.1, duration: '20s' },
  { size: '160px', top: '45%', left: '46%', opacity: 0.08, duration: '26s' }
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
      {particleData.map((particle, index) => (
        <Box
          key={index}
          position="absolute"
          top={particle.top}
          left={particle.left}
          width={particle.size}
          height={particle.size}
          bg={`rgba(${hexToRgb(particleColor)}, 0.08)`}
          borderRadius="full"
          filter="blur(20px)"
          opacity={particle.opacity}
          animation={`drift ${particle.duration} ease-in-out infinite`}
          transition="background-color 0.8s ease"
        />
      ))}
      <Box
        position="absolute"
        inset={0}
        bg={`radial-gradient(circle at 20% 20%, ${adjustColor(particleColor, 0.12)}, transparent 35%), radial-gradient(circle at 80% 80%, ${adjustColor(particleColor, 0.1)}, transparent 30%)`}
        transition="background 0.8s ease"
      />
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

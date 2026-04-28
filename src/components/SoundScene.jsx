import { Box, Button, IconButton, Container, Flex, Heading, Text, VStack, Spinner } from '@chakra-ui/react';
import VolumeControl from './VolumeControl.jsx';

// Helper function to adjust color brightness
function adjustBrightness(color, amount) {
  // Simple brightness adjustment for hex colors
  const usePound = color[0] === '#';
  const col = usePound ? color.slice(1) : color;

  const num = parseInt(col, 16);
  let r = (num >> 16) + amount;
  let g = (num >> 8 & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;

  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;

  return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16);
}

export default function SoundScene({ mood, isPlaying, onToggle, engineReady, volume, onVolumeChange, isTransitioning }) {
  return (
    <Box
      position="relative"
      width="100%"
      borderRadius="3xl"
      overflow="hidden"
      boxShadow="2xl"
      bg={{ base: 'rgba(255,255,255,0.04)', md: 'rgba(255,255,255,0.06)' }}
      border="1px solid"
      borderColor="whiteAlpha.100"
      backdropFilter="blur(18px)"
      zIndex={1}
    >
      <Box p={{ base: 6, md: 10 }}>
        <Container maxW="container.md" centerContent>
          <VStack spacing={5} align="center" textAlign="center">
            <Heading size="xl" letterSpacing="tight" color="white">
              {mood.emoji} {mood.label}
            </Heading>
            <Text fontSize={["md", "lg"]} color="whiteAlpha.800" maxW="720px">
              {mood.description}
            </Text>
            <Flex direction="column" align="center" gap={3} width="100%">
                  <IconButton 
                    aria-label="{isPlaying ? 'Stop' : 'Play'}" 
                    rounded="full" 
                    variant="ghost"
                    size="lg"
                    colorScheme={isPlaying ? 'orange' : 'teal'}
                    onClick={onToggle}
                    width={{ base: 'full', md: 'auto' }}
                    _hover={{ bg: 'none' }}
                    _active={{ bg: 'none' }}
                    disabled={!engineReady || isTransitioning}
                  >
                      {isTransitioning ? <Spinner size="lg" color="white" /> : <Text fontSize="6xl">{isPlaying ? '⏹️' : '▶️'}</Text>}
                  </IconButton>
              <Box width={{ base: 'full', md: '300px' }} px={4}>
                <VolumeControl volume={volume} onVolumeChange={onVolumeChange} />
              </Box>
            </Flex>
          </VStack>
        </Container>
      </Box>
      <Box
        position="absolute"
        inset={0}
        bg={mood.background}
        opacity={0.2}
        filter="blur(18px)"
        pointerEvents="none"
      />
    </Box>
  );
}

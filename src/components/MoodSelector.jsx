import { Button, SimpleGrid, Text, VStack } from '@chakra-ui/react';

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

export default function MoodSelector({ moods, selectedMood, onSelect }) {
  return (
    <VStack spacing={4} align="stretch" maxW="900px" width="100%" zIndex={2}>
      <Text fontSize={["lg", "xl"]} fontWeight="600" color="whiteAlpha.800" textAlign="center">
        Pick your mood and let the soundscape settle in.
      </Text>
      <SimpleGrid columns={[3]} spacing={3}>
        {Object.entries(moods).map(([key, mood]) => (
          <Button
            key={key}
            onClick={() => onSelect(key)}
            borderRadius="2xl"
            py={6}
            px={4}
            bg={selectedMood === key ? mood.color : 'whiteAlpha.100'}
            color={selectedMood === key ? 'white' : 'whiteAlpha.900'}
            border={selectedMood === key ? '2px' : '1px'}
            borderColor={selectedMood === key ? adjustBrightness(mood.color, 30) : 'whiteAlpha.300'}
            _hover={{ bg: selectedMood === key ? adjustBrightness(mood.color, -20) : 'whiteAlpha.200' }}
            _active={{ bg: selectedMood === key ? adjustBrightness(mood.color, -30) : 'whiteAlpha.250' }}
            transition="all 0.3s ease"
          >
            <Text fontSize="3xl">{mood.emoji}</Text>
            <Text mt={2} fontSize="sm" fontWeight="600">
              {mood.label}
            </Text>
          </Button>
        ))}
      </SimpleGrid>
    </VStack>
  );
}

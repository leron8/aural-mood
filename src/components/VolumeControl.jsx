import { Box, Flex, Icon, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, VStack } from '@chakra-ui/react';

export default function VolumeControl({ volume, onVolumeChange }) {
  // Convert dB to percentage (0 dB = 100%, -60 dB = 0%)
  // Using a simple linear scale from -60 to 0 dB
  const MIN_DB = -60;
  const MAX_DB = 0;
  const percentage = ((volume - MIN_DB) / (MAX_DB - MIN_DB)) * 100;

  const handleChange = (newPercentage) => {
    // Convert percentage back to dB
    const newDb = (newPercentage / 100) * (MAX_DB - MIN_DB) + MIN_DB;
    onVolumeChange(newDb);
  };

  return (
    <VStack spacing={3} width="100%" align="stretch">
      <Flex align="center" justify="space-between">
        <Text fontSize="sm" fontWeight="600" color="whiteAlpha.800">
          Volume
        </Text>
        <Text fontSize="xs" color="whiteAlpha.600">
          {Math.round(percentage)}%
        </Text>
      </Flex>
      <Slider
        aria-label="volume-slider"
        value={percentage}
        onChange={handleChange}
        min={0}
        max={100}
        step={1}
        colorScheme="teal"
        height="6px"
      >
        <SliderTrack bg="whiteAlpha.200" height="6px" borderRadius="full">
          <SliderFilledTrack bg="teal.400" height="6px" borderRadius="full" />
        </SliderTrack>
        <SliderThumb boxSize={5} bg="teal.400" border="2px solid white" />
      </Slider>
    </VStack>
  );
}

import { Box, chakra, Container } from "@chakra-ui/react";
import { PayBlock } from "@/components/Pay";
import { SignIn } from "@/components/SignIn";
import { VerifyBlock } from "@/components/Verify";
import NextImage from "next/image";
import { Image as ChakraImage } from "@chakra-ui/react";
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl'

export default function Home() {
  return (
    <Container 
      maxW="100vw" 
      h="100vh" 
      bg="gray.50" 
      centerContent 
      py={8}
    >
      <Box
        w={['100%', '380px']}
        h={['100%', '780px']}
        bg="white"
        borderRadius={['0', '40px']}
        boxShadow="2xl"
        overflow="hidden"
        position="relative"
        border={['none', '8px solid']}
        borderColor="gray.300"
        display="flex"
        flexDirection="column"
      > 
        <Box display="flex" justifyContent="center" mb={0} pb={0}>
          <ChakraImage asChild margin={4} mb={2} pb={0}>
            <NextImage src="/lively.png" alt="notch" width={100} height={25} />
        </ChakraImage>

          </Box>

        <Box 
          h="100%" 
          overflowY="auto" 
          px={4} 
          flex="1"
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <SignIn />
        </Box>
      </Box>
    </Container>
  );
}

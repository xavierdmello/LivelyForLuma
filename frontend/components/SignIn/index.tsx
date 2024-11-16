"use client";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@chakra-ui/react"
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";
import {Box} from "@chakra-ui/react";
export const SignIn = () => {
const { address, isConnected, chain } = useAccount();

return (
  <>  
   <DynamicWidget />
   <Button colorScheme="red.500" variant="surface" padding="5px" onClick={() => signIn()}>Sign in With Worldcoin</Button>

 

  </>
)
  
};

function SignInThingy() {
  return (
    <Box 
      width="100%" 
      height="100%" 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      margin="2rem"
    >
      <Box>

        
      </Box>
    </Box>
  )
}
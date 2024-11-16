"use client";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@chakra-ui/react"
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";
import {Box} from "@chakra-ui/react";
import mapboxgl from 'mapbox-gl'
import { useReadContract } from 'wagmi'
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef } from "react";

export const SignIn = () => {
const { address, isConnected, chain } = useAccount();
const { data: session } = useSession();
const mapRef = useRef<mapboxgl.Map | null>(null);
const mapContainerRef = useRef<HTMLDivElement | null>(null);
const livelyAddress = process.env.NEXT_PUBLIC_LIVELY as `0x${string}`;

const {data: data} = useReadContract({
  address: livelyAddress,
  abi: [],
  functionName: 'getBalance',
  args: [address]
})

useEffect(() => {
  



  
  if (mapContainerRef.current) {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGFjb2NhdDQ2NDIiLCJhIjoiY20za280d2Z4MGd1azJrczcxMmFuajBueCJ9.LHliYmwenOrUXMiEtWLGxQ';

    // Attempt to get the user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Initialize the map with the user's location as the center
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current as HTMLElement,
          style: 'mapbox://styles/mapbox/streets-v12', // style URL
          center: [longitude, latitude], // user's location
          zoom: 10.12 // default zoom
        });

        // Add geolocate control to the map.
        mapRef.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
          })
        );
      },
      (error) => {
        console.error("Error getting user's location:", error);

        // Fallback to a default location if user location is not available
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current as HTMLElement,
          style: 'mapbox://styles/mapbox/streets-v12', // style URL
          center: [-74.0242, 40.6941], // default center
          zoom: 10.12 // default zoom
        });

        // Add geolocate control to the map.
        mapRef.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
          })
        );
      }
    );

    return () => {
      mapRef.current?.remove();
    };
  }
}, []);

return (
  <>  
    <Box display="flex" justifyContent="center" alignItems="center" width="100%">
   {session && <Button colorScheme="red.500" variant="surface" padding="5px" onClick={() => signIn()}>Sign in With Worldcoin</Button>}
   </Box>
   {!session && <DynamicWidget />}
   {!session && <div id='map-container' ref={mapContainerRef}/>}


 

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
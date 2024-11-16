"use client";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button } from "@chakra-ui/react";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { useAccount } from "wagmi";
import { Box } from "@chakra-ui/react";
import mapboxgl from "mapbox-gl";
import { useReadContract } from "wagmi";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import abi from "../../public/abi";

export const SignIn = () => {
  const { address, isConnected, chain } = useAccount();
  const { data: session } = useSession();
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const livelyAddress = process.env.NEXT_PUBLIC_LIVELY as `0x${string}`;

  const { data: data } = useReadContract({
    address: livelyAddress,
    abi: abi,
    functionName: "getAllEvents",
  });
  
  useEffect(() => {
    if (mapContainerRef.current) {
      mapboxgl.accessToken =
        "pk.eyJ1IjoidGFjb2NhdDQ2NDIiLCJhIjoiY20za280d2Z4MGd1azJrczcxMmFuajBueCJ9.LHliYmwenOrUXMiEtWLGxQ";

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current as HTMLElement,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [longitude, latitude],
            zoom: 10.12,
          });

          mapRef.current.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true,
              },
              trackUserLocation: true,
              showUserHeading: true,
            })
          );

          // Create a custom marker element for the user's current location
          const userLocationMarker = document.createElement('div');
          userLocationMarker.className = 'user-location-marker';

          // Add the custom marker to the map
          new mapboxgl.Marker(userLocationMarker)
            .setLngLat([longitude, latitude])
            .addTo(mapRef.current);

          // Add markers if data is available
          if (data) {
            data.forEach((event) => {
              const marker = new mapboxgl.Marker()
                .setLngLat([parseFloat(event.long), parseFloat(event.lat)])
                .setPopup(
                  new mapboxgl.Popup({ offset: 25 }).setHTML(
                    `<h3>${event.name}</h3><a href="${event.lumaLink}" target="_blank">View Event</a>`
                  )
                )
                .addTo(mapRef.current!);
            });
          }
        },
        (error) => {
          console.error("Error getting user's location:", error);

          mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current as HTMLElement,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [-74.0242, 40.6941],
            zoom: 10.12,
          });

          mapRef.current.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true,
              },
              trackUserLocation: true,
              showUserHeading: true,
            })
          );

          // Add markers if data is available
          if (data) {
            data.forEach((event) => {
              const marker = new mapboxgl.Marker()
                .setLngLat([parseFloat(event.long), parseFloat(event.lat)])
                .setPopup(
                  new mapboxgl.Popup({ offset: 25 }).setHTML(
                    `<h3>${event.name}</h3><a href="${event.lumaLink}" target="_blank">View Event</a>`
                  )
                )
                .addTo(mapRef.current!);
            });
          }
        }
      );

      return () => {
        mapRef.current?.remove();
      };
    }
  }, [data]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        width="100%"
      >
        {session && (
          <Button
            colorScheme="red.500"
            variant="surface"
            padding="5px"
            onClick={() => signIn()}
          >
            Sign in With Worldcoin
          </Button>
        )}
      </Box>
      {!session && <DynamicWidget />}
      {!session && <div id="map-container" ref={mapContainerRef} />}
    </>
  );
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
      <Box></Box>
    </Box>
  );
}

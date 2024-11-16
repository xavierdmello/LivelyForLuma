"use client";
import { signIn, signOut, useSession } from "next-auth/react";

import { Button, Image } from "@chakra-ui/react";
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
            zoom: 11.12,
            dragPan: false
          });

          mapRef.current.scrollZoom.disable();

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
                  new mapboxgl.Popup({ 
                    offset: [0, -15],  // Offset popup above the marker
                    anchor: 'bottom'    // Anchor popup to bottom
                  }).setHTML(
                    `<h3>${event.name}</h3><a href="${event.lumaLink}" target="_blank" style="color: #E91E63;">View Event</a>`
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
            zoom: 11.12,
            dragPan: false
          });

          mapRef.current.scrollZoom.disable();

          mapRef.current.addControl(
            new mapboxgl.GeolocateControl({
              positionOptions: {
                enableHighAccuracy: true,
              },
              trackUserLocation: true,
              showUserHeading: true,
            })
          );

          // Add markers if data is available (in error callback)
          if (data) {
            data.forEach((event) => {
              const marker = new mapboxgl.Marker()
                .setLngLat([parseFloat(event.long), parseFloat(event.lat)])
                .setPopup(
                  new mapboxgl.Popup({ 
                    offset: [0, -15],
                    anchor: 'bottom'
                  }).setHTML(
                    `<h3>${event.name}</h3><a href="${event.lumaLink}" target="_blank" style="color: #E91E63;">View Event</a>`
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
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="100vh"
      >
        {/* Dynamic Widget */}
        <DynamicWidget />

        {/* Event List */}
        <Box
          overflowY="scroll"
          width="100%"
          height="50vh" // Adjusted height for the event list
          margin="4"
          px="0"
        >
          {data && data
            .sort((a, b) => b.score - a.score) // Sort by highest overall scores
            .map((event) => (
              <Box
                key={event.id}
                display="flex"
                flexDirection="row"
                alignItems="center"
                borderWidth="1px"
                borderRadius="lg"
                overflow="hidden"
                marginBottom="4"
                padding="4"
                onClick={() => window.open(event.lumaLink, "_blank")}
                cursor="pointer"
              >
                <Box flexShrink="0">
                  <Image src={event.imageUrl} alt={event.name} width="100px" />
                </Box>
                <Box marginLeft="4">
                  <Box fontWeight="bold" as="h3">
                    {event.name}
                  </Box>
                  <Box>{event.location}</Box>
                </Box>
              </Box>
            ))}
        </Box>

        {/* Map Container */}
        <Box
          id="map-container"
          ref={mapContainerRef}
          width="100%"
          height="20vh" // Shorter height for the map
          borderRadius="lg"
          borderWidth="1px"
          margin="4"
          padding="4"
        />
      </Box>
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

"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MiniKitProvider from "@/components/minikit-provider";
import dynamic from "next/dynamic";
import NextAuthProvider from "@/components/next-auth-provider";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
const inter = Inter({ subsets: ["latin"] });
import { DynamicWagmiConnector } from '@dynamic-labs/wagmi-connector';
import {
  createConfig,
  WagmiProvider,
  useAccount,
} from 'wagmi';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { mainnet, arbitrumSepolia } from 'viem/chains';

const config = createConfig({
  chains: [arbitrumSepolia],
  multiInjectedProviderDiscovery: false,
  transports: {
    [arbitrumSepolia.id]: http(),
  },
});


const queryClient = new QueryClient();
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ErudaProvider = dynamic(
    () => import("../components/Eruda").then((c) => c.ErudaProvider),
    {
      ssr: false,
    }
  );
  return (
    <html lang="en" suppressHydrationWarning>
      <NextAuthProvider>
      <ChakraProvider value={defaultSystem}>
        <ErudaProvider>

          <MiniKitProvider>
          <DynamicContextProvider
      settings={{
        // Find your environment id at https://app.dynamic.xyz/dashboard/developer
        environmentId: "588cc0c4-95ab-4f60-85dd-1deb799ec822",
        
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
          <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DynamicWagmiConnector>
       
     
              <body className={inter.className}>{children}</body>
            
            </DynamicWagmiConnector>
        </QueryClientProvider>
      </WagmiProvider>
            </DynamicContextProvider>
          </MiniKitProvider>
    
        </ErudaProvider>
        </ChakraProvider>
      </NextAuthProvider>
    </html>
  );
}

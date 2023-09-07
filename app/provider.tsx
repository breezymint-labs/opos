"use client";
import * as React from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as web3 from "@solana/web3.js";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
require("@solana/wallet-adapter-react-ui/styles.css");

// import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import { useMemo } from "react";
import {
//   GlowWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  MathWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// const theme = extendTheme({
//     config: {
//       initialColorMode: "dark",
//     },
//   });
  

export function Providers({ children }: { children: React.ReactNode }) {

    const wallets = useMemo(
        () => [
          new PhantomWalletAdapter(),
        //   new SolflareWalletAdapter(),
        //   new GlowWalletAdapter(),
        //   new MathWalletAdapter(),
        ],
        []
      );
    // const endpoint = web3.clusterApiUrl("devnet");
    // const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];
    const endpoint = useMemo(() => clusterApiUrl("mainnet-beta"), []);

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                {mounted && children}
            </WalletProvider>
        </ConnectionProvider>
    );
}

"use client";

import { AuthKitProvider } from "@farcaster/auth-kit";
import "@farcaster/auth-kit/styles.css";

const config = {
    rpcUrl: "https://mainnet.optimism.io",
    domain: "momcoined.com",
    siweUri: "https://momcoined.com/login",
};

import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

export default function FarcasterProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const load = async () => {
            sdk.actions.ready();
        };
        load();
    }, []);

    return (
        <AuthKitProvider config={config}>
            {children}
        </AuthKitProvider>
    );
}

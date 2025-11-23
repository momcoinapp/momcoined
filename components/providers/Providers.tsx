"use client";

import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserSessionProvider } from "@/components/providers/UserSessionProvider";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <UserSessionProvider>
                    {children}
                </UserSessionProvider>
            </WagmiProvider>
        </QueryClientProvider>
    );
}

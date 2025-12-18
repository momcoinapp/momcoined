"use client";

import { WagmiProvider } from "wagmi";
import { config } from "@/lib/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserSessionProvider } from "@/components/providers/UserSessionProvider";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    const OnchainKitProviderAny = OnchainKitProvider as any;

    return (
        <QueryClientProvider client={queryClient}>
            <WagmiProvider config={config}>
                <OnchainKitProviderAny apiKey={process.env.NEXT_PUBLIC_CDP_API_KEY} chain={base}>
                    <UserSessionProvider>
                        {children}
                    </UserSessionProvider>
                </OnchainKitProviderAny>
            </WagmiProvider>
        </QueryClientProvider>
    );
}

"use client";

import { useCallback } from "react";

// Hook for sharing content via Farcaster composeCast
export function useShareToFarcaster() {
    const shareCard = useCallback(
        (cardId: string, recipientName: string, senderName: string, message?: string) => {
            const shareUrl = new URL(`${window.location.origin}/share/card/${cardId}`);
            shareUrl.searchParams.set("to", recipientName);
            shareUrl.searchParams.set("from", senderName);
            if (message) shareUrl.searchParams.set("msg", message);

            const text = `🎁 I just sent a Momcoined card to ${recipientName}! Claim yours on Base:`;

            // Use Warpcast intent URL for sharing
            const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(shareUrl.toString())}`;

            window.open(warpcastUrl, "_blank");
        },
        []
    );

    const shareJar = useCallback(
        (jarId: string, ownerName: string, cookieCount: number, tier: string) => {
            const shareUrl = new URL(`${window.location.origin}/share/jar/${jarId}`);
            shareUrl.searchParams.set("owner", ownerName);
            shareUrl.searchParams.set("cookies", cookieCount.toString());
            shareUrl.searchParams.set("tier", tier);

            const text = `🍪 Check out my Cookie Jar with ${cookieCount} cookies! I'm a ${tier} Mom on Momcoined:`;

            const warpcastUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(shareUrl.toString())}`;

            window.open(warpcastUrl, "_blank");
        },
        []
    );

    return { shareCard, shareJar };
}

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot, updateDoc, increment } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

interface UserData {
    walletAddress: string;
    joinedAt: any;
    momBalance: number;
    leaderboardScore: number;
    referralCode: string;
    referredBy?: string | null;
    referralCount?: number;
    referralPoints?: number;
    tasksCompleted?: string[];
    aiAgentActive?: boolean;
    lastClaimTime?: any;
    totalClaimed?: number;
    cookiesGiven?: number;
    farcasterId?: number;
    farcasterUsername?: string;
    farcasterPfp?: string;
    displayName?: string;
    twitterHandle?: string;
    instagramHandle?: string;
}

interface UserSessionContextType {
    userData: UserData | null;
    isLoading: boolean;
    userAddress?: string;
    updateUserScore: (type: string, points: number) => Promise<void>;
}

const UserSessionContext = createContext<UserSessionContextType>({
    userData: null,
    isLoading: true,
    userAddress: undefined,
    updateUserScore: async () => { },
});

import sdk from "@farcaster/miniapp-sdk";

export function UserSessionProvider({ children }: { children: React.ReactNode }) {
    const { address, isConnected } = useAccount();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Sync Wallet User & Farcaster Context
    useEffect(() => {
        let unsubscribe: () => void;

        async function syncUser() {
            if (!isConnected || !address) {
                setUserData(null);
                setIsLoading(false);
                return;
            }

            const walletAddress = address.toLowerCase();
            const userRef = doc(db, "users", walletAddress);

            try {
                // Get Farcaster Context (if available) -> Update Profile
                const context = await sdk.context;
                let farcasterData = {};
                if (context?.user) {
                    farcasterData = {
                        farcasterId: context.user.fid,
                        farcasterUsername: context.user.username,
                        farcasterPfp: context.user.pfpUrl,
                        displayName: context.user.displayName,
                    };
                }

                const urlParams = new URLSearchParams(window.location.search);
                const refCode = urlParams.get("ref");

                unsubscribe = onSnapshot(userRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        const existingData = docSnap.data();
                        // If we have new Farcaster data that isn't saved, update it
                        if (context?.user && !existingData.farcasterId) {
                            await updateDoc(userRef, farcasterData);
                        }
                        setUserData({ ...existingData, ...farcasterData } as UserData);
                    } else {
                        const newUser: UserData = {
                            walletAddress,
                            joinedAt: serverTimestamp(),
                            momBalance: 0,
                            leaderboardScore: 0,
                            referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                            referredBy: refCode || null,
                            referralCount: 0,
                            referralPoints: 0,
                            tasksCompleted: [],
                            aiAgentActive: false,
                            totalClaimed: 0,
                            ...farcasterData // seed with FC data
                        };
                        await setDoc(userRef, newUser);
                    }
                    setIsLoading(false);
                }, (error) => {
                    console.error("Error listening to user data:", error);
                    setIsLoading(false);
                });

            } catch (error) {
                console.error("Error syncing user:", error);
                setIsLoading(false);
            }
        }

        syncUser();

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [address, isConnected]);

    const updateUserScore = async (type: string, points: number) => {
        if (!address) return;
        const userRef = doc(db, "users", address.toLowerCase());
        try {
            await updateDoc(userRef, {
                leaderboardScore: increment(points)
            });
        } catch (error) {
            console.error("Error updating score:", error);
        }
    };

    return (
        <UserSessionContext.Provider value={{ userData, isLoading, userAddress: address, updateUserScore }}>
            {children}
        </UserSessionContext.Provider>
    );
}

export const useUserSession = () => useContext(UserSessionContext);

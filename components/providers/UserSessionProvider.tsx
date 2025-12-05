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

export function UserSessionProvider({ children }: { children: React.ReactNode }) {
    const { address, isConnected } = useAccount();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Listen for Firebase Auth state (Newsletter/Email)
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("Firebase User:", user.email);
            }
        });
        return () => unsubscribe();
    }, []);

    // Sync Wallet User
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
                const urlParams = new URLSearchParams(window.location.search);
                const refCode = urlParams.get("ref");

                unsubscribe = onSnapshot(userRef, async (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData(docSnap.data() as UserData);
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

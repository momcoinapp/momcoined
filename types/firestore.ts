import { Timestamp } from "firebase/firestore";

export interface UserProfile {
    walletAddress: string;
    referralCode: string;
    referredBy?: string; // Wallet address or code of the referrer
    joinedAt: Timestamp;

    // Balances & Scores
    momBalance: number;
    leaderboardScore: number;

    // Stats
    totalClaimed: number;
    totalEarned: number;
    referralCount: number;

    // Activity
    lastClaimTime?: Timestamp;
    tasksCompleted: string[]; // IDs of completed tasks

    // AI Agent
    aiAgentActive: boolean;
    tradingParams?: {
        riskLevel: "Conservative" | "Balanced" | "Aggressive" | "Degen";
        tradingStyle: string;
    };
}

export interface ClaimHistory {
    id: string;
    userId: string;
    type: "daily" | "social" | "referral" | "trade";
    amount: number;
    timestamp: Timestamp;
    description: string;
}

export interface LeaderboardEntry {
    userId: string;
    score: number;
    rank: number;
    avatar?: string; // URL or NFT image
    username?: string; // ENS or Farcaster handle
}

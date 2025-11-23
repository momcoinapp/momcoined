import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY || "NEYNAR_API_DOCS";
const client = new NeynarAPIClient({ apiKey: NEYNAR_API_KEY });

export interface FarcasterUser {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
    followerCount: number;
    verifications: string[];
}

export async function getUserByAddress(address: string): Promise<FarcasterUser | null> {
    try {
        return null;
    } catch (error) {
        console.error("Neynar lookup error:", error);
        return null;
    }
}

export async function getUserData(fid: number): Promise<FarcasterUser | null> {
    try {
        const response = await client.fetchBulkUsers({ fids: [fid] });
        if (response.users && response.users.length > 0) {
            const user = response.users[0];
            return {
                fid: user.fid,
                username: user.username || "",
                displayName: user.display_name || "",
                pfpUrl: user.pfp_url || "",
                followerCount: user.follower_count || 0,
                verifications: user.verifications || [],
            };
        }
        return null;
    } catch (error) {
        console.error("Neynar fetch error:", error);
        return null;
    }
}

export async function calculateSocialScore(fid: number): Promise<{ score: number; tier: string }> {
    const user = await getUserData(fid);
    if (!user) return { score: 0, tier: "Common" };

    let score = 0;
    score += user.followerCount * 1;

    if (user.fid < 10000) score += 1000;
    else if (user.fid < 100000) score += 500;

    let tier = "Common";
    if (score > 1000) tier = "Legendary";
    else if (score > 200) tier = "Rare";

    return { score, tier };
}


export interface Cast {
    hash: string;
    author: {
        username: string;
        pfp_url: string;
        display_name: string;
    };
    text: string;
    timestamp: string;
    reactions: {
        likes_count: number;
        recasts_count: number;
    };
}

export async function getMomCoinFeed(): Promise<Cast[]> {
    try {
        // Fetch casts from the 'momcoin' channel or user
        // Note: This is a simplified call. In production, use specific channel/user ID.
        // For now, we'll search for "MomCoin" or fetch from a specific FID if known.

        // Mocking the response structure for now as we might not have the exact channel ID yet.
        // In a real scenario: await client.fetchFeedForChannel('momcoin');

        // Let's use a search or user feed if we have the FID.
        // Assuming MomCoin FID is known or we search.

        return [
            {
                hash: "0x1",
                author: { username: "momcoin", display_name: "MomCoin", pfp_url: "https://github.com/shadcn.png" },
                text: "Just minted my first MomGen NFT! 🍪 #MomCoin",
                timestamp: new Date().toISOString(),
                reactions: { likes_count: 42, recasts_count: 12 }
            },
            {
                hash: "0x2",
                author: { username: "vitalik", display_name: "Vitalik", pfp_url: "https://github.com/shadcn.png" },
                text: "MomCoin is actually pretty interesting...",
                timestamp: new Date(Date.now() - 86400000).toISOString(),
                reactions: { likes_count: 1000, recasts_count: 500 }
            }
        ];
    } catch (error) {
        console.error("Feed fetch error:", error);
        return [];
    }
}

import { NeynarAPIClient } from "@neynar/nodejs-sdk";

const NEYNAR_API_KEY = process.env.NEXT_PUBLIC_NEYNAR_API_KEY!;
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

export async function getCookieScore(tokenId: string): Promise<number> {
    try {
        // Search for casts that link to this specific Jar
        // Query: "app.momcoined.com/jar/{tokenId}"
        // Note: This requires the NEYNAR_API_KEY to be valid.

        // Mock implementation for now as we might not have a paid plan active or the URL isn't live yet.
        // In production:
        // const res = await client.fetchCasts({ q: `app.momcoined.com/jar/${tokenId}` });
        // const score = res.casts.reduce((acc, cast) => acc + cast.reactions.likes_count + cast.reactions.recasts_count + cast.replies.count, 0);

        // Returning random score for demo purposes
        return Math.floor(Math.random() * 500);
    } catch (error) {
        console.error("Cookie score fetch error:", error);
        return 0;
    }
}

// Verification Utilities

export async function verifyLike(fid: number, hash: string): Promise<boolean> {
    try {
        // Use fetchBulkCasts to check viewer_context
        // Passing 'casts' as array of strings (hashes) based on error message indicating it expects string[]
        const castRes = await client.fetchBulkCasts({ casts: [hash], viewerFid: fid });
        if (castRes.result.casts && castRes.result.casts.length > 0) {
            return castRes.result.casts[0].viewer_context?.liked || false;
        }
        return false;
    } catch (error) {
        console.error("Verify like error:", error);
        return false;
    }
}

export async function verifyRecast(fid: number, hash: string): Promise<boolean> {
    try {
        const castRes = await client.fetchBulkCasts({ casts: [hash], viewerFid: fid });
        if (castRes.result.casts && castRes.result.casts.length > 0) {
            return castRes.result.casts[0].viewer_context?.recasted || false;
        }
        return false;
    } catch (error) {
        console.error("Verify recast error:", error);
        return false;
    }
}

export async function verifyFollow(userFid: number, targetFid: number): Promise<boolean> {
    try {
        const response = await client.fetchBulkUsers({ fids: [targetFid], viewerFid: userFid });
        if (response.users && response.users.length > 0) {
            return response.users[0].viewer_context?.following || false;
        }
        return false;
    } catch (error) {
        console.error("Verify follow error:", error);
        return false;
    }
}

export async function verifyCastWithUrl(fid: number, url: string): Promise<boolean> {
    try {
        const response = await client.fetchCastsForUser({ fid, limit: 10 });

        if (response.casts) {
            return response.casts.some(cast =>
                cast.text.includes(url) ||
                cast.embeds?.some(embed => (embed as any).url?.includes(url))
            );
        }
        return false;
    } catch (error) {
        console.error("Verify URL share error:", error);
        return false;
    }
}

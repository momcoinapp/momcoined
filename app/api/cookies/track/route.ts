import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// POST /api/cookies/track - Track social engagement for cookies
export async function POST(req: NextRequest) {
    try {
        const { walletAddress, action, platform, castHash, jarId } = await req.json();

        if (!walletAddress || !action) {
            return NextResponse.json({ error: "Missing walletAddress or action" }, { status: 400 });
        }

        // Validate action type
        const validActions = ["share", "like", "recast", "comment", "referral"];
        if (!validActions.includes(action)) {
            return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
        }

        // Cookie rewards by action
        const cookieRewards: Record<string, number> = {
            share: 50,
            like: 10,
            recast: 25,
            comment: 15,
            referral: 100,
        };

        const cookiesEarned = cookieRewards[action] || 0;

        if (!adminDb) {
            // Firebase Admin not configured - return mock success
            return NextResponse.json({
                success: true,
                cookiesEarned,
                message: "Tracked (Firebase Admin not configured)",
            });
        }

        // Record engagement in Firebase
        const engagementRef = adminDb.collection("cookie_engagements").doc();
        await engagementRef.set({
            walletAddress: walletAddress.toLowerCase(),
            action,
            platform: platform || "unknown",
            castHash: castHash || null,
            jarId: jarId || null,
            cookiesEarned,
            createdAt: new Date(),
        });

        // Update user's total cookie count
        const userRef = adminDb.collection("users").doc(walletAddress.toLowerCase());
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            const currentCookies = userDoc.data()?.cookieCount || 0;
            await userRef.update({
                cookieCount: currentCookies + cookiesEarned,
                lastEngagement: new Date(),
            });
        } else {
            await userRef.set({
                walletAddress: walletAddress.toLowerCase(),
                cookieCount: cookiesEarned,
                lastEngagement: new Date(),
                createdAt: new Date(),
            });
        }

        return NextResponse.json({
            success: true,
            cookiesEarned,
            message: `+${cookiesEarned} cookies for ${action}!`,
        });

    } catch (error: any) {
        console.error("Cookie tracking error:", error);
        return NextResponse.json({ error: error.message || "Failed to track" }, { status: 500 });
    }
}

// GET /api/cookies/track?wallet=0x... - Get user's cookie count
export async function GET(req: NextRequest) {
    const wallet = req.nextUrl.searchParams.get("wallet");

    if (!wallet) {
        return NextResponse.json({ error: "Missing wallet param" }, { status: 400 });
    }

    if (!adminDb) {
        return NextResponse.json({ cookieCount: 0, message: "Firebase not configured" });
    }

    try {
        const userDoc = await adminDb.collection("users").doc(wallet.toLowerCase()).get();

        if (!userDoc.exists) {
            return NextResponse.json({ cookieCount: 0 });
        }

        return NextResponse.json({
            cookieCount: userDoc.data()?.cookieCount || 0,
            lastEngagement: userDoc.data()?.lastEngagement?.toDate() || null,
        });

    } catch (error: any) {
        console.error("Cookie fetch error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch" }, { status: 500 });
    }
}

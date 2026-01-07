import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// POST /api/cookies/checkin - Daily "Ask Mom for Cookie" check-in
export async function POST(req: NextRequest) {
    try {
        const { walletAddress } = await req.json();

        if (!walletAddress) {
            return NextResponse.json({ error: "Missing walletAddress" }, { status: 400 });
        }

        const userKey = walletAddress.toLowerCase();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Cookie reward for daily check-in
        const DAILY_COOKIE_REWARD = 50;

        if (!adminDb) {
            // Firebase Admin not configured - return mock success
            return NextResponse.json({
                success: true,
                cookiesEarned: DAILY_COOKIE_REWARD,
                totalCookies: DAILY_COOKIE_REWARD,
                message: `Mom gave you ${DAILY_COOKIE_REWARD} cookies! 🍪 (Firebase not configured)`,
                canCheckinAgain: false,
            });
        }

        // Check if user already checked in today
        const userRef = adminDb.collection("users").doc(userKey);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            const lastCheckin = userDoc.data()?.lastCheckin?.toDate();
            if (lastCheckin && lastCheckin >= today) {
                return NextResponse.json({
                    success: false,
                    message: "You already asked Mom for cookies today! Come back tomorrow 🍪",
                    canCheckinAgain: false,
                    nextCheckin: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                }, { status: 429 });
            }

            // Update existing user
            const currentCookies = userDoc.data()?.cookieCount || 0;
            const newTotal = currentCookies + DAILY_COOKIE_REWARD;
            const streak = (userDoc.data()?.checkInStreak || 0) + 1;

            await userRef.update({
                cookieCount: newTotal,
                lastCheckin: new Date(),
                checkInStreak: streak,
            });

            return NextResponse.json({
                success: true,
                cookiesEarned: DAILY_COOKIE_REWARD,
                totalCookies: newTotal,
                streak,
                message: `Mom gave you ${DAILY_COOKIE_REWARD} cookies! 🍪 (${streak} day streak!)`,
                canCheckinAgain: false,
            });
        } else {
            // Create new user
            await userRef.set({
                walletAddress: userKey,
                cookieCount: DAILY_COOKIE_REWARD,
                lastCheckin: new Date(),
                checkInStreak: 1,
                createdAt: new Date(),
            });

            return NextResponse.json({
                success: true,
                cookiesEarned: DAILY_COOKIE_REWARD,
                totalCookies: DAILY_COOKIE_REWARD,
                streak: 1,
                message: `Welcome! Mom gave you ${DAILY_COOKIE_REWARD} cookies! 🍪`,
                canCheckinAgain: false,
            });
        }

    } catch (error: any) {
        console.error("Checkin error:", error);
        return NextResponse.json({ error: error.message || "Failed to check in" }, { status: 500 });
    }
}

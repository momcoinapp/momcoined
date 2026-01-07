import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// GET /api/leaderboard - Get top cookie collectors
export async function GET(req: NextRequest) {
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "25");
    const wallet = req.nextUrl.searchParams.get("wallet");

    if (!adminDb) {
        // Return mock data if Firebase not configured
        return NextResponse.json({
            leaderboard: [
                { rank: 1, address: "0x1234...5678", cookies: 1250, isTop25: true },
                { rank: 2, address: "0xabcd...efgh", cookies: 980, isTop25: true },
                { rank: 3, address: "0x9876...5432", cookies: 750, isTop25: true },
            ],
            userRank: wallet ? { rank: 42, cookies: 150, isTop25: false } : null,
        });
    }

    try {
        // Get top users by cookie count
        const snapshot = await adminDb
            .collection("users")
            .orderBy("cookieCount", "desc")
            .limit(limit)
            .get();

        const leaderboard = snapshot.docs.map((doc, index) => ({
            rank: index + 1,
            address: doc.id.slice(0, 6) + "..." + doc.id.slice(-4),
            fullAddress: doc.id,
            cookies: doc.data().cookieCount || 0,
            streak: doc.data().checkInStreak || 0,
            isTop25: index < 25,
        }));

        // Get user's rank if wallet provided
        let userRank = null;
        if (wallet) {
            const userDoc = await adminDb.collection("users").doc(wallet.toLowerCase()).get();

            if (userDoc.exists) {
                const userCookies = userDoc.data()?.cookieCount || 0;

                // Count how many users have more cookies
                const higherCount = await adminDb
                    .collection("users")
                    .where("cookieCount", ">", userCookies)
                    .count()
                    .get();

                const rank = higherCount.data().count + 1;

                userRank = {
                    rank,
                    cookies: userCookies,
                    streak: userDoc.data()?.checkInStreak || 0,
                    isTop25: rank <= 25,
                    eligibleForFreeReveal: rank <= 25,
                };
            }
        }

        return NextResponse.json({
            leaderboard,
            userRank,
            totalUsers: snapshot.size,
        });

    } catch (error: any) {
        console.error("Leaderboard error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch" }, { status: 500 });
    }
}

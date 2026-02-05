import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebaseAdmin";

// POST /api/user/sync
// Syncs user profile with Farcaster/Base details
export async function POST(req: NextRequest) {
    try {
        const { walletAddress, fid, username, displayName, pfp } = await req.json();

        if (!walletAddress) {
            return NextResponse.json({ error: "Missing walletAddress" }, { status: 400 });
        }

        const userKey = walletAddress.toLowerCase();

        if (!adminDb) {
            return NextResponse.json({ success: true, message: "Mock sync (No Firebase)" });
        }

        const userRef = adminDb.collection("users").doc(userKey);

        const updateData: any = {
            walletAddress: userKey,
            lastLogin: new Date(),
        };

        if (fid) updateData.fid = fid;
        if (username) updateData.username = username;
        if (displayName) updateData.displayName = displayName;
        if (pfp) updateData.pfp = pfp;

        await userRef.set(updateData, { merge: true });

        return NextResponse.json({ success: true, message: "User synced" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

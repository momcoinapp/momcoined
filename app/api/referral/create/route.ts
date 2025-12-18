import { NextRequest, NextResponse } from "next/server";
import { getOrCreateReferralCode } from "@/lib/referral";

export async function POST(req: NextRequest) {
    try {
        const { walletAddress } = await req.json();

        if (!walletAddress) {
            return NextResponse.json({ error: "Wallet address required" }, { status: 400 });
        }

        const code = await getOrCreateReferralCode(walletAddress);

        return NextResponse.json({ code });
    } catch (error) {
        console.error("Error creating referral code:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

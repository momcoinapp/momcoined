import { NextRequest, NextResponse } from "next/server";
import { processReferral } from "@/lib/referral";

export async function POST(req: NextRequest) {
    try {
        const { walletAddress, code } = await req.json();

        if (!walletAddress || !code) {
            return NextResponse.json({ error: "Missing data" }, { status: 400 });
        }

        const result = await processReferral(walletAddress, code);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, referrer: result.referrerAddress });
    } catch (error) {
        console.error("Error claiming referral:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

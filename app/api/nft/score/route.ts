import { NextRequest, NextResponse } from "next/server";
import { calculateSocialScore } from "@/lib/neynar";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const fid = searchParams.get("fid");

    if (!fid) {
        return NextResponse.json({ error: "FID required" }, { status: 400 });
    }

    try {
        const { score, tier } = await calculateSocialScore(Number(fid));
        return NextResponse.json({ score, tier });
    } catch (error) {
        console.error("Score calculation error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}


import { NextResponse } from "next/server";
import { getMomCoinFeed } from "@/lib/neynar";

export async function GET() {
    try {
        const casts = await getMomCoinFeed();
        return NextResponse.json(casts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
    }
}

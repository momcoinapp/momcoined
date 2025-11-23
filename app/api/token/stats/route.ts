import { NextResponse } from "next/server";
import { getTokenStats } from "@/lib/basescan";

export async function GET() {
    try {
        const stats = await getTokenStats();
        return NextResponse.json(stats);
    } catch (error) {
        console.error("Token stats error:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Cache for 60 seconds

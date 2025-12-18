import { NextRequest, NextResponse } from "next/server";

// Webhook endpoint for Farcaster Frame interactions
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Log the interaction for debugging
        console.log("Farcaster Frame webhook:", body);

        // Handle different frame actions
        // This is where you'd process user interactions with your frame

        return NextResponse.json({
            success: true,
            message: "Webhook received"
        });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal server error"
        }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({
        status: "Webhook endpoint active",
        frame: "MomCoin Farcaster Frame"
    });
}

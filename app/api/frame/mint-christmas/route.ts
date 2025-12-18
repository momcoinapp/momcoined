import { NextRequest, NextResponse } from "next/server";

const HOST_URL = process.env.NEXT_PUBLIC_URL || "https://app.momcoined.com";

export async function POST(req: NextRequest) {
    // In a real frame, we'd validate the message signature here
    // const body = await req.json();

    // Respond with the "Success" Frame
    return new NextResponse(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta property="fc:frame" content="vNext" />
            <meta property="fc:frame:image" content="${HOST_URL}/christmas-success.png" />
            <meta property="fc:frame:button:1" content="View on BaseScan" />
            <meta property="fc:frame:action:1" content="link" />
            <meta property="fc:frame:target:1" content="https://basescan.org" />
            <meta name="og:title" content="MomCoin Christmas Card Claimed!" />
            <meta name="og:image" content="${HOST_URL}/christmas-success.png" />
        </head>
        </html>
    `, {
        headers: {
            "Content-Type": "text/html",
        },
    });
}

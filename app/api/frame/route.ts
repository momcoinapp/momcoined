import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://momcoined.com";

export async function POST(req: NextRequest) {
    return getResponse(req);
}

export async function GET(req: NextRequest) {
    return getResponse(req);
}

async function getResponse(req: NextRequest) {
    // Basic Frame Response
    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${BASE_URL}/mom-coin-logo.jpg" />
        <meta property="fc:frame:button:1" content="Get Advice" />
        <meta property="fc:frame:button:2" content="Buy $MOM" />
        <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
      </head>
      <body>
        <h1>MomCoin Frame</h1>
      </body>
    </html>
  `;

    return new NextResponse(html, {
        headers: { "Content-Type": "text/html" },
    });
}

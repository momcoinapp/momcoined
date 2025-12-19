import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.momcoined.com";

export async function POST(req: NextRequest) {
  return getResponse(req);
}

export async function GET(req: NextRequest) {
  return getResponse(req);
}

async function getResponse(req: NextRequest) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta property="fc:frame" content="vNext" />
        <meta property="fc:frame:image" content="${BASE_URL}/og-preview.jpg" />
        <meta property="fc:frame:button:1" content="Your Mom Would Be Proud 🍪" />
        <meta property="fc:frame:button:1:action" content="link" />
        <meta property="fc:frame:button:1:target" content="https://warpcast.com/momcoined" />
        
        <meta property="fc:frame:button:2" content="Get Your Daily Allowance 💰" />
        <meta property="fc:frame:button:2:action" content="link" />
        <meta property="fc:frame:button:2:target" content="${BASE_URL}/tasks" />
        
        <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
      </head>
      <body>
        <h1>MomCoin Community</h1>
      </body>
    </html>
  `;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html" },
  });
}

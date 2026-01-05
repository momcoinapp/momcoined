import { NextRequest, NextResponse } from "next/server";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://app.momcoined.com";

export async function POST(req: NextRequest) {
  return getResponse(req);
}

export async function GET(req: NextRequest) {
  return getResponse(req);
}

async function getResponse(req: NextRequest) {
  // Support context-aware frames via query params
  const { searchParams } = new URL(req.url);
  const context = searchParams.get("context") || "home";

  // Dynamic content based on context
  const frameConfig = getFrameConfig(context);

  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
    <!-- Primary Meta Tags -->
    <title>${frameConfig.title}</title>
    <meta name="title" content="${frameConfig.title}" />
    <meta name="description" content="${frameConfig.description}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${BASE_URL}" />
    <meta property="og:title" content="${frameConfig.title}" />
    <meta property="og:description" content="${frameConfig.description}" />
    <meta property="og:image" content="${frameConfig.image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@momcoined" />
    <meta name="twitter:title" content="${frameConfig.title}" />
    <meta name="twitter:description" content="${frameConfig.description}" />
    <meta name="twitter:image" content="${frameConfig.image}" />
    
    <!-- Farcaster Frame v2 Meta Tags (Client-Agnostic) -->
    <meta property="fc:frame" content="vNext" />
    <meta property="fc:frame:image" content="${frameConfig.image}" />
    <meta property="fc:frame:image:aspect_ratio" content="1.91:1" />
    
    <!-- Button 1: Primary Action -->
    <meta property="fc:frame:button:1" content="${frameConfig.button1}" />
    <meta property="fc:frame:button:1:action" content="link" />
    <meta property="fc:frame:button:1:target" content="${frameConfig.button1Target}" />
    
    <!-- Button 2: Secondary Action -->
    <meta property="fc:frame:button:2" content="${frameConfig.button2}" />
    <meta property="fc:frame:button:2:action" content="link" />
    <meta property="fc:frame:button:2:target" content="${frameConfig.button2Target}" />
    
    <!-- Button 3: Tertiary Action -->
    <meta property="fc:frame:button:3" content="${frameConfig.button3}" />
    <meta property="fc:frame:button:3:action" content="link" />
    <meta property="fc:frame:button:3:target" content="${frameConfig.button3Target}" />
    
    <!-- Button 4: Cookie Jars -->
    <meta property="fc:frame:button:4" content="${frameConfig.button4}" />
    <meta property="fc:frame:button:4:action" content="link" />
    <meta property="fc:frame:button:4:target" content="${frameConfig.button4Target}" />
    
    <meta property="fc:frame:post_url" content="${BASE_URL}/api/frame" />
  </head>
  <body>
    <h1>Momcoin App</h1>
    <p>${frameConfig.description}</p>
  </body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
      "Cache-Control": "public, max-age=300"
    },
  });
}

function getFrameConfig(context: string) {
  const configs: Record<string, {
    title: string;
    description: string;
    image: string;
    button1: string;
    button1Target: string;
    button2: string;
    button2Target: string;
    button3: string;
    button3Target: string;
    button4: string;
    button4Target: string;
  }> = {
    home: {
      title: "Momcoin App - Bingo, Cookie Jars, MomAI on Base",
      description: "Win daily bingo, collect cookies for AI-reveal NFT jars, chat with MomAI. Family crypto on Base",
      image: `${BASE_URL}/og-image.png`,
      button1: "Play Bingo",
      button1Target: `${BASE_URL}/bingo`,
      button2: "Cookie Jars",
      button2Target: `${BASE_URL}/cookie-jar`,
      button3: "Send Cards",
      button3Target: `${BASE_URL}/cards`,
      button4: "Daily Claim",
      button4Target: `${BASE_URL}/tasks`,
    },
    bingo: {
      title: "Momcoin Bingo - Win USDC Daily",
      description: "Hourly MOMCOIN burn games + 5x daily USDC jackpots. Free ticket daily!",
      image: `${BASE_URL}/og-image.png`,
      button1: "Play Now",
      button1Target: `${BASE_URL}/bingo`,
      button2: "View Jackpot",
      button2Target: `${BASE_URL}/bingo`,
      button3: "Leaderboard",
      button3Target: `${BASE_URL}/leaderboard`,
      button4: "Home",
      button4Target: BASE_URL,
    },
    jars: {
      title: "Cookie Jars - AI-Reveal NFTs",
      description: "Collect cookies, fill jars, AI reveals your Mom or Kid tier NFT!",
      image: `${BASE_URL}/jar-placeholder.png`,
      button1: "Get a Jar",
      button1Target: `${BASE_URL}/cookie-jar`,
      button2: "Fill My Jar",
      button2Target: `${BASE_URL}/cookie-jar`,
      button3: "Leaderboard",
      button3Target: `${BASE_URL}/leaderboard`,
      button4: "Home",
      button4Target: BASE_URL,
    },
    cards: {
      title: "Holiday Cards - Send Onchain Love",
      description: "Send free NFT cards with mom quotes and MOM token gifts on Base",
      image: `${BASE_URL}/og-preview-holiday.jpg`,
      button1: "Send Card",
      button1Target: `${BASE_URL}/cards`,
      button2: "My Cards",
      button2Target: `${BASE_URL}/cards`,
      button3: "Bingo",
      button3Target: `${BASE_URL}/bingo`,
      button4: "Home",
      button4Target: BASE_URL,
    },
  };

  return configs[context] || configs.home;
}

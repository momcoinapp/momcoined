import { NextResponse } from "next/server";

export async function GET() {
    const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://momcoined.com";

    const metadata = {
        name: "Moms Cookie Jar",
        description: "The Mother of all NFTs has arrived on Base! 🍪🏠\n\nEvery legend starts with a Cookie Jar. Will yours reveal a Gangsta Mom, a Tech Mom, or the ultra-rare Diamond Hands Mom?\n\n🚀 **FOMO ALERT:** 5,958 Unique Moms. Once they're gone, they're gone.\n💥 **The Reveal:** Feed your jar to trigger a viral explosion.\n❤️ **The Mission:** We're bringing trust, charity, and community back to crypto.\n🌊 **Zora & OpenSea Ready.**\n\nDon't call your Mom... MINT HER.\n\nTwitter: https://x.com/blokmom\nFarcaster: @momcoin\nApp: https://app.momcoined.com",
        image: `${BASE_URL}/jar-placeholder.png`,
        external_link: "https://app.momcoined.com",
        seller_fee_basis_points: 500,
        fee_recipient: "0xYOUR_WALLET_ADDRESS"
    };

    return NextResponse.json(metadata);
}

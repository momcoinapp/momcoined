import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Params are now Promises in Next.js 15+
) {
    // Await params if necessary, though in 14 it might be direct. 
    // Adapting to Next.js 16/Canary changes if applicable, but standard is sync params.
    // However, to be safe with user environment:
    const { id } = await params;

    // Use the stored image (hosted on app or IPFS)
    // Ideally this image is immutable on IPFS, but for this campaign we use the Hosted URL.
    const imageUrl = "https://app.momcoined.com/cards/cryptmas-card.png";
    const externalUrl = "https://app.momcoined.com/christmas";

    const metadata = {
        name: `Mom HodlDAY Card #${id}`,
        description: "Part of the 2025 HodlDAY Collection. A personalized Christmas card minted on the MomCoin Proof of Love Consensus.",
        image: imageUrl,
        external_url: externalUrl,
        attributes: [
            { trait_type: "Event", value: "HodlDAY 2025" },
            { trait_type: "Chain", value: "Base" },
            { trait_type: "Type", value: "Holiday Card" }
        ]
    };

    return NextResponse.json(metadata);
}

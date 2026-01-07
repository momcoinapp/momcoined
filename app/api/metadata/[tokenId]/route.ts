import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { CONTRACT_ADDRESSES, MOM_COOKIE_JAR_ABI } from "@/lib/contracts";

// OpenSea/Base compatible NFT metadata API
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ tokenId: string }> }
) {
    const { tokenId } = await params;
    const tokenIdNum = parseInt(tokenId);

    if (isNaN(tokenIdNum) || tokenIdNum < 1) {
        return NextResponse.json({ error: "Invalid token ID" }, { status: 400 });
    }

    try {
        // Create public client for Base
        const client = createPublicClient({
            chain: base,
            transport: http(),
        });

        // Check if token exists and get tier
        let tier = 0;
        let owner = "";

        try {
            // Get owner (will throw if doesn't exist)
            owner = await client.readContract({
                address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR as `0x${string}`,
                abi: MOM_COOKIE_JAR_ABI,
                functionName: "ownerOf",
                args: [BigInt(tokenIdNum)],
            }) as string;

            // Get tier (0 = empty, 1-4 = filled)
            tier = Number(await client.readContract({
                address: CONTRACT_ADDRESSES.MOM_COOKIE_JAR as `0x${string}`,
                abi: MOM_COOKIE_JAR_ABI,
                functionName: "tokenTiers",
                args: [BigInt(tokenIdNum)],
            }));
        } catch (err) {
            return NextResponse.json({ error: "Token does not exist" }, { status: 404 });
        }

        // Tier names
        const tierNames: Record<number, string> = {
            0: "Sealed Cookie Jar",
            1: "BaseMom",
            2: "FarMom",
            3: "BaseKid",
            4: "FarKid",
        };

        const tierRarity: Record<number, string> = {
            0: "Unrevealed",
            1: "Legendary",
            2: "Rare",
            3: "Common",
            4: "Common",
        };

        const isSealed = tier === 0;
        const name = isSealed ? `Cookie Jar #${tokenId}` : `${tierNames[tier]} #${tokenId}`;
        const description = isSealed
            ? "A sealed Cookie Jar on Base. Fill it with cookies to reveal your BaseMom or BaseKid NFT!"
            : `A revealed ${tierNames[tier]} from Mom's Cookie Jar collection on Base.`;

        // Dynamic image URL
        const imageUrl = `https://app.momcoined.com/api/og/jar/${tokenId}?tier=${tierNames[tier]}&owner=${owner.slice(0, 8)}`;

        // Build attributes
        const attributes = [
            { trait_type: "Status", value: isSealed ? "Sealed" : "Revealed" },
            { trait_type: "Type", value: tierNames[tier] },
            { trait_type: "Rarity", value: tierRarity[tier] },
        ];

        // Add tier-specific traits
        if (!isSealed) {
            attributes.push({ trait_type: "Generation", value: "Genesis" });
            if (tier === 1 || tier === 2) {
                attributes.push({ trait_type: "Role", value: "Mom" });
            } else {
                attributes.push({ trait_type: "Role", value: "Kid" });
            }
        }

        const metadata = {
            name,
            description,
            image: imageUrl,
            external_url: `https://app.momcoined.com/jar/${tokenId}`,
            attributes,
            // OpenSea specific
            background_color: isSealed ? "1a1a2e" : "4a0072",
        };

        return NextResponse.json(metadata);

    } catch (error: any) {
        console.error("Metadata API error:", error);
        return NextResponse.json({ error: error.message || "Failed to fetch metadata" }, { status: 500 });
    }
}

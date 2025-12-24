import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ tokenId: string }> }
) {
    const { tokenId } = await params;

    // Try to fetch card data from Firebase for dynamic metadata
    let cardData = null;
    try {
        if (db) {
            const docSnap = await getDoc(doc(db, 'superhodlmas_cards', tokenId));
            if (docSnap.exists()) {
                cardData = docSnap.data();
            }
        }
    } catch (error) {
        console.error('Error fetching card data:', error);
    }

    // Build metadata - OpenSea/Zora compatible format
    const metadata = {
        name: cardData?.templateName
            ? `MomCoin Holiday Card: ${cardData.templateName}`
            : `MomCoin Holiday Card #${tokenId}`,
        description: cardData?.quote
            ? `"${cardData.quote}" — Free NFT holiday card from Mom & Son on Base. Claim MOMCOIN rewards + raffle entry.`
            : "Free NFT holiday card from Mom & Son on Base. Claim MOMCOIN rewards + raffle entry.",
        image: cardData?.imageUri
            ? `https://app.momcoined.com${cardData.imageUri}`
            : `https://app.momcoined.com/cards/Merry_CryptMas_-_Festive_crypto_Christmas_NFT.png`,
        animation_url: "https://app.momcoined.com/card-opening.mp4",
        external_url: `https://app.momcoined.com/claim/${tokenId}`,
        attributes: [
            { trait_type: "Quote", value: cardData?.quote || "Moms love meets crypto magic" },
            { trait_type: "Reward", value: "100 MOMCOIN" },
            { trait_type: "Rarity", value: cardData?.rarity || "Common" },
            { trait_type: "Event", value: cardData?.event === 'newyear' ? "New Year 2026" : "Christmas 2025" },
            { trait_type: "Style", value: cardData?.style || "wholesome" },
            { trait_type: "Status", value: cardData?.status || "pending" },
        ],
        properties: {
            files: [
                {
                    uri: cardData?.imageUri
                        ? `https://app.momcoined.com${cardData.imageUri}`
                        : `https://app.momcoined.com/cards/Merry_CryptMas_-_Festive_crypto_Christmas_NFT.png`,
                    type: "image/png"
                },
                { uri: "https://app.momcoined.com/card-opening.mp4", type: "video/mp4" }
            ],
            category: "image"
        }
    };

    return NextResponse.json(metadata);
}

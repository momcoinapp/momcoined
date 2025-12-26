import { NextRequest, NextResponse } from "next/server";

// Card data with unique funny MomCoin holiday quotes
const CARD_DATA: Record<number, { name: string; image: string; quote: string }> = {
    1: {
        name: "Merry CryptMas",
        image: "/cards/Merry_CryptMas_-_Festive_crypto_Christmas_NFT.png",
        quote: "All she wants for CryptMas is you off your phone for 5 minutes."
    },
    2: {
        name: "Diamond Hands Mom",
        image: "/cards/Diamond_Hands_Mom_-_Crypto_meme_NFT.png",
        quote: "She held you through every tantrum, you can hodl one red candle."
    },
    3: {
        name: "Bitcoin Mom",
        image: "/cards/Bitcoin_Mom_-_Crypto_maximalist_NFT.png",
        quote: "OG before OG—she was decentralized authority at home."
    },
    4: {
        name: "Mom Hodls the Dip",
        image: "/cards/Mom_Hodls_the_Dip_-_Trading_meme_NFT.png",
        quote: "She hodled your awkward phase, this dip is nothing."
    },
    5: {
        name: "Wen Lambo Mom",
        image: "/cards/Wen_Lambo_Mom_-_Crypto_humor_meme_NFT.png",
        quote: "She doesn't want a Lambo, she wants you to call her back."
    },
    6: {
        name: "Mom to the Moon",
        image: "/cards/Mom_to_the_Moon_-_Meme-inspired_crypto_NFT.png",
        quote: "Your portfolio: maybe rekt. Your mom: always to the moon."
    },
    7: {
        name: "Supermom Energy",
        image: "/cards/Supermom_Energy_NFT_-_Updated_with_branding_and_crypto_elements.png",
        quote: "She had superpowers before you discovered superchains."
    },
    8: {
        name: "The Greatest Gift",
        image: "/cards/The_Greatest_Gift_NFT_-_Updated_with_branding_and_crypto_elements.png",
        quote: "Number go up is cute, but mom showed up every time."
    },
    9: {
        name: "You Make the World Shine",
        image: "/cards/You_Make_the_World_Shine_NFT_-_Updated_with_branding_and_blockchain_elements.png",
        quote: "She's the real alpha, you're just LARPing."
    },
    10: {
        name: "Merry CryptMas Tree",
        image: "/cards/Merry_CryptMas_Tree_-_Holiday_crypto_pun_NFT.png",
        quote: "Tree lights: green. Portfolio: we don't talk about that."
    },
    11: {
        name: "Feliz NaviDApp",
        image: "/cards/Feliz_NaviDApp_-_Base_builders_&_Farcaster_focused.png",
        quote: "Shipping PRs and presents in the same week."
    },
    12: {
        name: "Web3 Degen Card",
        image: "/cards/Feliz_NaviDApp_-_Web3_degen_greeting_card.png",
        quote: "Dev by day, degen by night, still someone's favorite human."
    },
    13: {
        name: "Happy HodlDays",
        image: "/cards/Happy_HodlDays_-_Base_&_Farcaster_frens_card.png",
        quote: "For the fren who says GM more than good morning to their mom."
    },
    14: {
        name: "Degen Greetings",
        image: "/cards/HodlDays_Degen_Greetings_-_Crypto_friend_card.png",
        quote: "Onchain holiday card > group chat 'Merry Christmas' text."
    },
    15: {
        name: "Stack & Celebrate",
        image: "/cards/Stack_&_Celebrate_-_Base_&_Farcaster_community_card.png",
        quote: "Stack sats, stack memories, stack $MomCoin."
    },
    16: {
        name: "Crypto Celebrate",
        image: "/cards/Stack_and_Celebrate_-_Inclusive_crypto_greeting_card.png",
        quote: "We're all gonna make it, especially if you call your mom."
    },
    17: {
        name: "MomCoin Holiday Magic",
        image: "/Momcoin-Christmas.jpeg",
        quote: "Because 'thanks mom' hits different when it's onchain."
    },
    18: {
        name: "MomCoin Holiday Shine",
        image: "/Momcoin Christmas(1).jpeg",
        quote: "Hallmark could never. This one lives on Base."
    },
};

const BASE_URL = "https://app.momcoined.com";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const tokenId = parseInt(id, 10);

    const cardData = CARD_DATA[tokenId];
    const isAiCustom = tokenId >= 1000;

    const cardName = cardData?.name || (isAiCustom ? "AI Custom Card" : "HODLdays Card");
    const cardQuote = cardData?.quote || "Not financial advice, just emotional appreciation.";
    const imageUrl = cardData
        ? `${BASE_URL}${cardData.image}`
        : `${BASE_URL}/cards/hodlnftpreview.png`;

    const metadata = {
        name: `2025 HODLdays: ${cardName} #${id}`,
        description: `${cardQuote} | Part of the 2025 Happy HODLdays Collection. Free mint on Base. Someone special in your life sent this! Join MomCoin community for a free crypto present 🎁`,
        image: imageUrl,
        external_url: `${BASE_URL}/christmas`,
        attributes: [
            { trait_type: "Event", value: "Happy HODLdays 2025" },
            { trait_type: "Chain", value: "Base" },
            { trait_type: "Type", value: isAiCustom ? "AI Custom" : "Template Card" },
            { trait_type: "Card Style", value: cardName },
            { trait_type: "Quote", value: cardQuote }
        ]
    };

    return NextResponse.json(metadata);
}

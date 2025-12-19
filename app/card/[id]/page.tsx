
import { Metadata } from 'next';
import { CardViewer } from "@/components/features/CardViewer";

type Props = {
    params: Promise<{ id: string }>
}

const CARD_DATA: Record<number, { name: string; img: string }> = {
    1: { name: "Merry Cryptmas 🎄", img: "/cards/Merry_CryptMas_-_Festive_crypto_Christmas_NFT.png" },
    2: { name: "Diamond Hands Mom 💎", img: "/cards/Diamond_Hands_Mom_-_Crypto_meme_NFT.png" },
    3: { name: "Bitcoin Mom", img: "/cards/Bitcoin_Mom_-_Crypto_maximalist_NFT.png" },
    4: { name: "Mom Hodls The Dip", img: "/cards/Mom_Hodls_the_Dip_-_Trading_meme_NFT.png" },
    5: { name: "Wen Lambo Mom 🏎️", img: "/cards/Wen_Lambo_Mom_-_Crypto_humor_meme_NFT.png" },
    6: { name: "Mom to the Moon 🚀", img: "/cards/Mom_to_the_Moon_-_Meme-inspired_crypto_NFT.png" },
    7: { name: "Supermom Energy ⚡", img: "/cards/Supermom_Energy_NFT_-_Updated_with_branding_and_crypto_elements.png" },
    8: { name: "Greatest Gift 🎁", img: "/cards/The_Greatest_Gift_NFT_-_Updated_with_branding_and_crypto_elements.png" },
    9: { name: "World Shine 🌟", img: "/cards/You_Make_the_World_Shine_NFT_-_Updated_with_branding_and_blockchain_elements.png" },
    10: { name: "Merry CryptMas Tree 🎄", img: "/cards/Merry_CryptMas_Tree_-_Holiday_crypto_pun_NFT.png" },
    11: { name: "Feliz NaviDApp 🎅", img: "/cards/Feliz_NaviDApp_-_Base_builders_&_Farcaster_focused.png" },
    12: { name: "Web3 Degen Card 🎮", img: "/cards/Feliz_NaviDApp_-_Web3_degen_greeting_card.png" },
    13: { name: "Happy HodlDays 🟣", img: "/cards/Happy_HodlDays_-_Base_&_Farcaster_frens_card.png" },
    14: { name: "Degen Greetings 🔥", img: "/cards/HodlDays_Degen_Greetings_-_Crypto_friend_card.png" },
    15: { name: "Stack & Celebrate 📈", img: "/cards/Stack_&_Celebrate_-_Base_&_Farcaster_community_card.png" },
    16: { name: "Crypto Celebrate 🎉", img: "/cards/Stack_and_Celebrate_-_Inclusive_crypto_greeting_card.png" },
    17: { name: "MomCoin Holiday Magic ✨", img: "/Momcoin Christmas.jpeg" },
    18: { name: "MomCoin Holiday Shine 💖", img: "/Momcoin Christmas(1).jpeg" },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const cardId = parseInt(id);
    const card = CARD_DATA[cardId];

    // Default or Custom
    const title = card ? `${card.name} - MomCoin HodlDay Card` : "You received a Mom HodlDAY Card! 🎄";
    const description = "Open to see your personal message and claim your digital gift. Free on Base!";
    const imageUrl = card ? `https://app.momcoined.com${card.img}` : "https://app.momcoined.com/cards/cryptmas-card.png";

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: [imageUrl],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
            images: [imageUrl],
        },
        other: {
            "fc:miniapp": JSON.stringify({
                version: "1.0",
                name: "Mom Hodl Card",
                iconUrl: "https://app.momcoined.com/icon.png",
                imageUrl: imageUrl,
                button: { label: "Open Gift 🎁" },
                postUrl: "https://app.momcoined.com/api/frame"
            })
        }
    }
}

export default async function Page({ params }: Props) {
    const { id } = await params;
    return <CardViewer id={id} />;
}

import { ChristmasCardCreator } from "@/components/features/ChristmasCardCreator";

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MomCoin HodlDays - Create Your Card',
    description: 'Mint a free Christmas NFT for Mom on Base. Gas covered!',
    openGraph: {
        title: 'MomCoin HodlDays - Create Your Card',
        description: 'Mint a free Christmas NFT for Mom on Base. Gas covered!',
        images: ['https://app.momcoined.com/cards/hodlnftpreview.png'],
    },
    other: {
        "fc:miniapp": JSON.stringify({
            version: "1.0",
            name: "Mom Hodl Mint",
            iconUrl: "https://app.momcoined.com/logo.png",
            imageUrl: "https://app.momcoined.com/cards/hodlnftpreview.png",
            splashImageUrl: "https://app.momcoined.com/cards/hodlnftpreview.png",
            splashBackgroundColor: "#000000",
            button: { label: "Mint Card 🎄" },
            postUrl: "https://app.momcoined.com/api/frame"
        })
    }
};

export default function CardsPage() {
    return (
        <div className="min-h-screen bg-black pt-24 pb-20 px-4 flex justify-center">
            <ChristmasCardCreator />
        </div>
    );
}

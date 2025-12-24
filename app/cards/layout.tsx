import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "CryptoChristmas Card NFT Mailer | Happy New Year from Mom",
    description: "Send free holiday NFT cards on Base. Claim MOMCOIN rewards, enter raffles.",
    openGraph: {
        title: "MomCoin Holiday NFT Card Mailer",
        description: "Free NFT cards on Base. Claim MOMCOIN rewards. #nft #holiday #gifting",
        images: ['https://app.momcoined.com/cards/Merry_CryptMas_-_Festive_crypto_Christmas_NFT.png'],
        url: 'https://app.momcoined.com/cards',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MomCoin Holiday NFT Card Mailer',
        description: 'Free NFT cards on Base. Claim MOMCOIN rewards.',
        images: ['https://app.momcoined.com/cards/Merry_CryptMas_-_Festive_crypto_Christmas_NFT.png'],
    },
};

export default function CardsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

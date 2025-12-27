import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "HodlDay Card NFT Mailer | Happy New Year 2026 from Mom",
    description: "Send free holiday NFT cards on Base. Claim MOMCOIN rewards, enter raffles. Happy New Year 2026!",
    openGraph: {
        title: "HodlDay NFT Card Mailer - New Year 2026",
        description: "Free NFT holiday cards on Base. Claim MOMCOIN rewards. #nft #holiday #newyear",
        images: ['https://app.momcoined.com/hero.jpeg'],
        url: 'https://app.momcoined.com/cards',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'HodlDay NFT Card Mailer - New Year 2026',
        description: 'Free NFT holiday cards on Base. Claim MOMCOIN rewards.',
        images: ['https://app.momcoined.com/hero.jpeg'],
    },
};

export default function CardsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
